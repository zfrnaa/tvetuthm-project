"use client"

import { useState, useRef, useMemo, useTransition, lazy, Suspense } from "react";
import ReportCard from "../components/ui/cards/ReportCard";
// import { TanStackTable } from "@/components/TanStackTable";
// import { ScatterChart } from "../components/ScatterChart";
import { TableDataRow, ReportDataRow, SimpleDataType } from "../components/features/ReportPDF";
const TanStackTable = lazy(() => import("@/components/data-display/TanStackTable").then(module => ({ default: module.TanStackTable })));
const ScatterChart = lazy(() => import("../components/data-display/charts/Scatter-Chart").then(module => ({ default: module.ScatterChart })));
const PDFDownload = lazy(() => import("../components/features/ReportPDF").then(module => ({ default: module.PDFDownload })));
const PDFPreview = lazy(() => import("../components/features/ReportPDF").then(module => ({ default: module.PDFPreview })));
import { RadarChartC, PieChartC, TotalAssessmentContent, HorizontalBarChart } from "@/components/data-display/charts/Collection-Graph";
import { useWindowDimensionsContext } from "@/lib/contexts/useWindowDimensionsContext";
import Modal from "../components/ui/dialogs/Modal";
import type { ReportDocument, UserData } from "@/types/ReportTypes";
import { useResults } from "@/hooks/useResults";
import { useUsers } from "@/hooks/useUsers";
import { usePrograms } from "@/hooks/usePrograms";
import { LoadingGeneral } from "@/components/ui/feedback/loading";
import { useVisitors } from "@/hooks/useVisitors";
import { ClusterReport } from "@/components/programs/LatEvalProgram";
import { Building2, BookOpen, User, Shield, GraduationCap } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { clusterNameToId } from "../../model/clusterNameToId";
import { Button } from "@/components/ui/button";
import { ComboboxCreatable } from "@/components/ui/forms/ComboboxCreatable";

const Laporan = () => {
    const { isMobile } = useWindowDimensionsContext();
    const [reportData, setReportData] = useState<ReportDataRow[]>([]);
    const [tableData, setTableData] = useState<TableDataRow[]>([]);
    const [showInstitutionModal, setShowInstitutionModal] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Refs for chart containers
    const assessmentChartRef = useRef<HTMLDivElement>(null);
    const pieChartRef = useRef<HTMLDivElement>(null);
    const institutionChartRef = useRef<HTMLDivElement>(null);

    // Call individual hooks
    const { data: resultsData, isLoading: resultsLoading, isError: resultsError } = useResults();
    const { data: usersData, isLoading: usersLoading, isError: usersError } = useUsers();
    const { data: programsData, isLoading: programsLoading, isError: programsError } = usePrograms();
    const { data: visitorsData, isLoading: visitorsLoading, isError: visitorsError } = useVisitors();

    // Combine loading and error states
    const isLoading = resultsLoading || usersLoading || programsLoading || visitorsLoading;
    const isError = resultsError || usersError || programsError || visitorsError;

    // Assuming merging of data happens here
    const mergedReportData = useMemo<ReportDocument[]>(() => {
        if (!resultsData || !usersData || !programsData) return [];
        return (resultsData as ReportDocument[]).map((report) => {
            // Using report.programId (document ID) to find the matching program
            const matchedProgram = programsData.find(program => program.programId === report.programId);

            const matchedUser = usersData.find((user) => user.id === report.userId);

            return {
                ...report,
                // Override faculty if a matching user is found
                faculty: matchedUser ? matchedUser.faculty : report.faculty || "N/A",
                institution: matchedUser ? matchedUser.institution : report.institution || "N/A",
                // Map the actual programId from the programs collection
                programId: matchedProgram ? matchedProgram.programId : "",
                starRating: matchedProgram ? matchedProgram.starRating : report.starRating ?? 0,
            };
        });
    }, [programsData, resultsData, usersData]);

    const userData: UserData[] = useMemo(() => usersData || [], [usersData]);
    const programData = useMemo(() => programsData || [], [programsData]);

    // Prepare reportSummary from the fetched data.
    const simpleSummary: SimpleDataType = {
        assessmentCount: mergedReportData.length,
        registeredPrograms: programData.length,
        activeUsers: visitorsData?.length || 0,
    };

    // Parse and normalize clusterScores for RadarChartC
    const radarChartData = useMemo(() => {
        const programReports = mergedReportData
            .filter(report => report.programId === selectedProgram)
            .sort((a, b) => {
                // Handle Firestore Timestamp or string date
                const getDate = (val: any) => {
                    if (val && typeof val === "object" && "toDate" in val) return val.toDate();
                    if (val && typeof val === "object" && "seconds" in val) return new Date(val.seconds * 1000);
                    return new Date(val);
                };
                return getDate(b.completed_at).getTime() - getDate(a.completed_at).getTime();
            });

        if (programReports.length === 0) return [];

        // Use the latest report's cippScores (Firebase: map of arrays)
        const cippScores = programReports[0].cippScores as Record<string, number[]> | undefined;

        // Map to CIPP model
        const cippMapping: Record<string, string> = {
            Konteks: "Context",
            Input: "Input",
            Proses: "Process",
            Produk: "Product",
        };

        return Object.keys(cippMapping).map((key) => {
            const arr = Array.isArray(cippScores?.[key]) ? cippScores![key] : [0, 1];
            const [obtained, full] = arr;
            const normalizedScore =
                typeof obtained === "number" && typeof full === "number" && full > 0
                    ? Math.min((obtained / full) * 100, 100)
                    : 0;
            return {
                Element: cippMapping[key],
                Score: normalizedScore,
            };
        });
    }, [selectedProgram, mergedReportData]);

    const handleProgramChange = (value: string) => {
        setSelectedProgram(value);
    };

    const selectedProgramName = useMemo(() => {
        if (!selectedProgram || !programsData) return undefined;
        return programsData.find(p => p.programId === selectedProgram)?.programName;
    }, [selectedProgram, programsData]);

    // Group assessments by month for the last 6 months.
    const getMonthlyAssessmentData = () => {
        const now = new Date();
        const data = [];
        for (let i = 4; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthLabel = d.toLocaleString("default", { month: "short" });
            // Count assessments with a completed_at date matching the month and year.
            const count = mergedReportData.filter(report => {
                const reportDate = report.completed_at && typeof report.completed_at === 'object' && 'getTime' in report.completed_at
                    ? report.completed_at
                    : report.completed_at && typeof report.completed_at === 'object' && 'toDate' in report.completed_at // Handle Firestore Timestamp
                        ? (report.completed_at as { toDate(): Date }).toDate()
                        : new Date(report.completed_at);
                return reportDate.getMonth() === d.getMonth() &&
                    reportDate.getFullYear() === d.getFullYear();
            }).length;
            data.push({ month: monthLabel, User: count });
        }
        return data;
    };

    // Compute chart data from the fetched results
    const assessmentChartData = getMonthlyAssessmentData();

    // Transform the fetched mergedReportData into PDF table data.
    const transformTableData = (): TableDataRow[] => {
        return mergedReportData.map((doc, index) => {
            let dateStr = "Tarikh Tidak Sah";
            const value = doc.completed_at;
            // Use type assertion for Firestore Timestamp objects
            if (value && typeof value === "object" && 'seconds' in value && typeof (value as Timestamp).seconds === "number") {
                // Firestore Timestamp
                const date = new Date((value as Timestamp).seconds * 1000);
                dateStr = date.toLocaleDateString();
            } else if (typeof value === "string" && value.trim() !== "") {
                // ISO string
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    dateStr = date.toLocaleDateString();
                }
            }
            return {
                assessment: `Penilaian ${index + 1}`,
                score: doc.totalScore !== undefined ? `Markah: ${doc.totalScore}` : "N/A",
                date: dateStr,
            };
        });
    };

    const clusterData = useMemo(() => {
        if (!selectedProgram || !mergedReportData) return [];

        // Find the report for the selected program
        const programReport = mergedReportData.find((report) => report.programId === selectedProgram);
        if (!programReport || !programReport.clusterScores) return [];

        const rawClusterScores =
            (programReport.clusterScores && typeof programReport.clusterScores === 'object' && !Array.isArray(programReport.clusterScores))
                ? (programReport.clusterScores as Record<string, number[]>)
                : {} as Record<string, number[]>;

        // Predefined cluster names, icons, and colors
        const predefinedClusters = [
            {
                id: "industry-network",
                name: "Rangkaian Industri",
                icon: Building2,
                color: "bg-yellow-500 dark:bg-cyan-900",
                description: "Perkongsian industri dan rangkaian kerjasama",
                metrics: [
                    { name: "Perkongsian Industri" },
                    { name: "Penglibatan Industri" },
                    { name: "Projek Kerjasama" },
                ],
            },
            {
                id: "curriculum",
                name: "Pembangunan & Penyampaian Kurikulum",
                icon: BookOpen,
                color: "bg-green-500 dark:bg-cyan-900",
                description: "Reka bentuk kurikulum, kandungan dan kaedah penyampaian",
                metrics: [
                    { name: "Perkaitan Kurikulum" },
                    { name: "Kaedah Pengajaran" },
                    { name: "Sumber Pembelajaran" },
                ],
            },
            {
                id: "instructors",
                name: "Kualiti Pengajar dan Sumber TVET",
                icon: User,
                color: "bg-orange-500 dark:bg-cyan-900",
                description: "Instructor qualifications and teaching resources",
                metrics: [
                    { name: "Kelayakan Pengajar" },
                    { name: "Pembangunan Profesional" },
                    { name: "Sumber Pengajaran" },
                ],
            },
            {
                id: "accreditation",
                name: "Akreditasi dan Pengiktirafan",
                icon: Shield,
                color: "bg-purple-500 dark:bg-cyan-900",
                description: "Akreditasi program dan pengiktirafan industri",
                metrics: [
                    { name: "Status Akreditasi" },
                    { name: "Pengiktirafan Industri" },
                    { name: "Jaminan Kualiti" },
                ],
            },
            {
                id: "employability",
                name: "Kebolehpasaran Graduan",
                icon: GraduationCap,
                color: "bg-rose-500 dark:bg-cyan-900",
                description: "Kadar pekerjaan siswazah dan hasil kerjaya",
                metrics: [
                    { name: "Kadar Pekerjaan" },
                    { name: "Penempatan Industri" },
                    { name: "Kemajuan Kerjaya" },
                ],
            },
        ];

        // Map predefined clusters with real scores
        return predefinedClusters.map((cluster) => {
            // Find the Firebase key that maps to this cluster.id
            const firebaseKey = Object.keys(clusterNameToId).find(
                (key) => clusterNameToId[key] === cluster.id
            );
            const scoreArr = firebaseKey ? rawClusterScores[firebaseKey] : undefined;
            if (Array.isArray(scoreArr) && scoreArr.length === 2) {
                const [actualScore, fullScore] = scoreArr;
                const percentage = (Number(actualScore) / Number(fullScore)) * 100;
                return {
                    ...cluster,
                    score: Math.round(percentage),
                    metrics: cluster.metrics.map((metric, index) => ({
                        ...metric,
                        value: Math.round(percentage) === 100
                            ? 100
                            : Math.round(percentage * (1 - index * 0.1)),
                    })),
                };
            }
            // Default to 0 if not found
            return {
                ...cluster,
                score: 0,
                metrics: cluster.metrics.map((metric) => ({
                    ...metric,
                    value: 0,
                })),
            };
        });
    }, [selectedProgram, mergedReportData]);

    const institutionAsmtData = useMemo(() => {
        if (!mergedReportData) return [];

        const counts: Record<string, number> = {};
        mergedReportData.forEach(report => {
            // const institutionValue = report.institution;
            // if (!institutionValue || institutionValue.trim() === "" || institutionValue.toLowerCase() === "unknown") {
            //     console.warn(`Report contributing to 'Institusi Tidak Diketahui':`, {
            //         reportId: report.id,
            //         userId: report.userId,
            //         originalInstitutionValue: institutionValue,
            //         programName: report.programName,
            //         completedAt: report.completed_at
            //     });
            // }
            const institutionKey = report.institution || "Institusi Tidak Diketahui";

            counts[institutionKey] = (counts[institutionKey] || 0) + 1;
        });

        // Convert to array format expected by the chart
        const calculatedData = Object.entries(counts).map(([institution, Assessments]) => ({
            institution, // This will be the Y-axis label
            Assessments, // This will be the X-axis value (bar length)
        }));

        return calculatedData;
    }, [mergedReportData]);

    // Get only the top 5 for the initial chart display
    const topInstitutionData = useMemo(() => {
        return institutionAsmtData.slice(0, 5);
    }, [institutionAsmtData]);

    const handleGeneratePDF = async () => {
        const transformedData = transformTableData();

        const transformedReportData = userData.map((doc) => ({
            name: doc.name || "N/A",
            institution: doc.institution || "N/A",
            faculty: doc.faculty || "N/A",
            programName: doc.programName || "N/A",
            position: doc.position || "N/A",
        }));

        // Use startTransition to update state without blocking UI
        startTransition(() => {
            setTableData(transformedData);
            setReportData(transformedReportData);
            setShowPdfPreview(true);
        });
    };

    const programOptions = useMemo(() => {
        return programData.map(program => ({
            value: program.programId,
            label: program.programName,
        }));
    }, [programData]);

    if (isLoading) return <LoadingGeneral />
    if (isError || !resultsData || !usersData || !programsData) return <div>Error loading data.</div>;

    return (
        <>
            <div className="min-h-screen max-w-fit mx-auto">
                <div className="px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Laporan dan Penilaian Data
                        </h2>
                        <button
                            onClick={handleGeneratePDF}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            aria-label="to generate PDF"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            )}
                            {isPending ? 'Menjana...' : 'Hasilkan PDF'}
                        </button>
                    </div>

                    {/* Report Cards */}
                    <div className={`grid mt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-10 justify-self-center`}>
                        <ReportCard title="Jumlah Penilaian" value={mergedReportData.length.toString()} />
                        <ReportCard title="Jumlah Penilai" value={userData.length.toString()} />
                        <ReportCard title="Jumlah Pelawat" value={(visitorsData?.length || 0).toString()} />
                    </div>

                    {/* Chart Section */}
                    <div className={`bg-white/70 dark:bg-gray-600 p-4 rounded-lg shadow mt-6 ${isMobile ? "flex flex-col" : "flex flex-row flex-wrap"} backdrop-blur-md shadow-blue-100 shadow-sm gap-6 w-full overflow-hidden justify-center`}>
                        <div ref={assessmentChartRef}>
                            <TotalAssessmentContent chartData={assessmentChartData} />
                        </div>
                        <div ref={pieChartRef}>
                            <PieChartC />
                        </div>
                        <div ref={institutionChartRef}>
                            <HorizontalBarChart
                                chartData={topInstitutionData}
                                fullDataLength={institutionAsmtData.length}
                                onShowAllClick={() => { setShowInstitutionModal(true) }}
                            />
                        </div>
                    </div>

                    {/* Chart based on program selection */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            Laporan Khusus Program
                        </h3>
                        <ComboboxCreatable
                            options={programOptions}
                            value={selectedProgram}
                            onChange={handleProgramChange}
                            placeholder="Pilih atau taip Program"
                            searchPlaceholder="Cari Program..."
                            notFoundMessage="Program tidak dijumpai."
                            itemTypeLabel="program"
                            maxInitialItems={5}
                            creatable={false}
                            className="w-full p-2 border border-black rounded-md
                            dark:bg-gray-700 dark:text-white"
                        />
                        <div className="mt-8">
                            {selectedProgram ? (
                                <Suspense fallback={<LoadingGeneral />}>
                                    <div>
                                        <div className="flex flex-col md:flex-row flex-wrap mb-4 gap-4 justify-center">
                                            <RadarChartC data={radarChartData} />
                                            <ScatterChart programId={selectedProgram} programName={selectedProgramName} />
                                        </div>
                                        <div>
                                            <ClusterReport clusterData={clusterData} />
                                        </div>
                                    </div>
                                </Suspense>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">Pilih untuk melihat carta dan butiran penilaian</p>
                            )}
                        </div>
                    </div>

                    <div className="max-w-fit p-4 bg-white/70 dark:bg-gray-600 backdrop-blur-md shadow-blue-100 rounded-2xl shadow-sm items-center mt-10 overflow-auto">
                        <Suspense fallback={<LoadingGeneral />}>
                            <TanStackTable userData={userData} reportData={mergedReportData} programData={programData} />
                        </Suspense>
                    </div>

                </div>
            </div>

            {/* PDF Preview Modal */}
            {showPdfPreview && (
                <Modal
                    title="Pralihat PDF"
                    isOpen={showPdfPreview}
                    onClose={() => setShowPdfPreview(false)}
                    size="xl"
                >
                    <div className="p-4">
                        <div className="mb-4">
                            <PDFDownload
                                simpleData={simpleSummary}
                                reportData={reportData}
                                tableData={tableData}
                                assessmentChartData={assessmentChartData}
                                pieChartProgramsData={programsData || []}
                                institutionChartData={institutionAsmtData}
                            />
                        </div>
                        <div className="h-[70vh]">
                            <PDFPreview
                                simpleData={simpleSummary}
                                reportData={reportData}
                                tableData={tableData}
                                assessmentChartData={assessmentChartData}
                                pieChartProgramsData={programsData || []}
                                institutionChartData={institutionAsmtData}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 p-4">
                        <button
                            onClick={() => setShowPdfPreview(false)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            aria-label="to close PDF preview"
                        >
                            Tutup
                        </button>
                    </div>
                </Modal>
            )}
            {/* All Institutions Modal */}
            {showInstitutionModal && (
                <Modal
                    title="Semua Penilaian Mengikut Institusi"
                    isOpen={showInstitutionModal}
                    onClose={() => setShowInstitutionModal(false)}
                    size="lg" // Adjust size as needed
                >
                    <div className="p-4 max-h-[70vh] overflow-y-auto">
                        <HorizontalBarChart
                            chartData={institutionAsmtData.sort((a, b) => b.Assessments - a.Assessments)}
                            fullDataLength={institutionAsmtData.length}
                            onShowAllClick={() => { }}
                            hideShowAllButton={true}
                        />
                    </div>
                    <div className="flex justify-end gap-4 p-4 border-t">
                        <Button
                            variant="destructive"
                            onClick={() => setShowInstitutionModal(false)}
                            aria-label="to close institution modal"
                        >
                            Tutup
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Laporan;