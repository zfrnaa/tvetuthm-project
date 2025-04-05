"use client"

import { useState, useRef, useMemo } from "react";
import ReportCard from "../components/ui/ReportCard";
import { TanStackTable } from "@/components/TanStackTable";
import { RadarChartC, PieChartC, TotalAssessmentContent } from "@/components/CollectionGraph";
import { useTranslation } from "react-i18next";
import { useWindowDimensionsContext } from "@/lib/contexts/useWindowDimensionsContext";
import { PDFDownload, PDFPreview, TableDataRow, ReportDataRow, SimpleDataType } from "../components/ReportPDF";
import Modal from "../components/ui/Modal";
import type { ReportDocument, UserData } from "@/types/ReportTypes";
import { useResults } from "@/hooks/useResults";
import { useUsers } from "@/hooks/useUsers";
import { usePrograms } from "@/hooks/usePrograms";
import { LoadingGeneral } from "@/components/ui/loading";
import { useVisitors } from "@/hooks/useVisitors";

const Laporan = () => {
    const { t } = useTranslation();
    const { isMobile } = useWindowDimensionsContext();
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [reportData, setReportData] = useState<ReportDataRow[]>([]);
    const [tableData, setTableData] = useState<TableDataRow[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const chartRef = useRef<HTMLDivElement>(null);

    // Call individual hooks
    const { data: resultsData, isLoading: resultsLoading, isError: resultsError, refetch: refetchResults } = useResults();
    const { data: usersData, isLoading: usersLoading, isError: usersError, refetch: refetchUsers } = useUsers();
    const { data: programsData, isLoading: programsLoading, isError: programsError } = usePrograms();
    const { data: visitorsData, isLoading: visitorsLoading, isError: visitorsError } = useVisitors();

    // Combine loading and error states
    const isLoading = resultsLoading || usersLoading || programsLoading || visitorsLoading;
    const isError = resultsError || usersError || programsError || visitorsError;

    // Refresh data function using React Query's refetch
    const refreshData = async () => {
        try {
            await Promise.all([refetchResults(), refetchUsers()]); // Trigger refetch for both hooks
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    // Assuming merging of data happens here
    const mergedReportData = useMemo<ReportDocument[]>(() => {
        if (!resultsData || !usersData || !programsData) return [];
        return (resultsData as ReportDocument[]).map((report) => {
            // Using report.userId to find a matching user
            const matchedUser = (usersData as UserData[]).find(user => user.id === report.userId);

            // Find the matching program by programId
            const matchedProgram = (programsData).find(program => program.programId === report.programId);

            return {
                ...report,
                // Override faculty if a matching user is found
                faculty: matchedUser ? matchedUser.faculty : report.faculty || "N/A",
                programId: matchedProgram ? matchedProgram.programId : null,
            };
        });
    }, [programsData, resultsData, usersData]);
    const userData: UserData[] = usersData || [];
    const programData = programsData || [];
    console.log("Results Data:", resultsData);

    // Prepare reportSummary from the fetched data.
    const simpleSummary: SimpleDataType = {
        assessmentCount: mergedReportData.length,
        registeredPrograms: programData.length,
        activeUsers: userData.filter(user => user.position === 'Active').length,
    };

    // Parse and normalize clusterScores for RadarChartC
    const radarChartData = useMemo(() => {
        if (!selectedProgram || !mergedReportData) return [];
        const programReports = mergedReportData.filter(report => report.programId === selectedProgram);

        console.log("Selected Program:", selectedProgram);
        console.log("Filtered Program Reports:", programReports);

        if (programReports.length === 0) return [];

        // Assuming we take the first report for the selected program
        const cippScores = programReports[0].cippScores || [];

        // Parse and normalize scores
        const parsedScores = cippScores.map((scoreString) => {
            const [cluster, obtained, full] = scoreString.split(":");
            const normalizedScore = (parseInt(obtained) / parseInt(full)) * 100;
            return { cluster, score: normalizedScore };
        });

        // Map to CIPP model
        const cippMapping: Record<string, string> = {
            Konteks: "Context",
            Input: "Input",
            Proses: "Process",
            Produk: "Product",
            Context: "Context",
            InputEng: "Input",
            Process: "Process",
            Product: "Product",
        };

        // Map to CIPP model
        return Object.keys(cippMapping).map((key) => {
            const clusterData = parsedScores.find((item) => item.cluster === key);
            return {
                Element: t(cippMapping[key]), // Translate the key
                Score: clusterData ? clusterData.score : 0,
            };
        });

    }, [selectedProgram, mergedReportData, t]);

    const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProgram(event.target.value);
    };

    // Group assessments by month for the last 6 months.
    const getMonthlyAssessmentData = () => {
        const now = new Date();
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthLabel = d.toLocaleString("default", { month: "short" });
            // Count assessments with a completed_at date matching the month and year.
            const count = mergedReportData.filter(report => {
                const reportDate = new Date(report.completed_at);
                return reportDate.getMonth() === d.getMonth() &&
                    reportDate.getFullYear() === d.getFullYear();
            }).length;
            data.push({ month: monthLabel, desktop: count, mobile: count });
        }
        return data;
    };

    // Compute chart data from the fetched results
    const assessmentChartData = getMonthlyAssessmentData();

    // Transform the fetched mergedReportData into PDF table data.
    const transformTableData = (): TableDataRow[] => {
        return mergedReportData.map((doc, index) => ({
            assessment: `Assessment ${index + 1}`,
            score: doc.totalScore !== undefined ? `Score: ${doc.totalScore}` : "N/A",
            date: new Date(doc.completed_at).toLocaleDateString(),
        }));
    };

    const handleGeneratePDF = () => {
        const transformedData = transformTableData();

        const transformedReportData = userData.map((doc) => ({
            name: doc.name || "N/A",
            institution: doc.institution || "N/A",
            faculty: doc.faculty || "N/A",
            programName: doc.programName || "N/A",
            position: doc.position || "N/A",
        }));
        setTableData(transformedData);
        setReportData(transformedReportData);
        setShowPdfPreview(true);
    };

    if (isLoading) return <LoadingGeneral />
    if (isError || !resultsData || !usersData || !programsData) return <div>Error loading data.</div>;

    return (
        <>
            <div className="min-h-screen max-w-fit overflow-x-auto mx-auto">
                <div className="px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            {t("Data Report and Assessment")}
                        </h2>
                        <button
                            onClick={handleGeneratePDF}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {t("Generate PDF")}
                        </button>
                    </div>

                    {/* Report Cards */}
                    <div className={`grid mt-6 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
                        <ReportCard title={t("Total Assessment")} value={mergedReportData.length.toString()} />
                        <ReportCard title={t("Total Evaluators")} value={userData.length.toString()} />
                        <ReportCard title={t("Total Visitors")} value={(visitorsData?.length || 0).toString()} />
                    </div>

                    {/* Chart Section */}
                    <div ref={chartRef} className={`bg-white/70 dark:bg-gray-600 p-4 rounded-lg shadow mt-6 ${isMobile ? "flex flex-col" : "flex flex-row flex-wrap"} backdrop-blur-md shadow-blue-100 shadow-sm gap-6 w-full overflow-hidden justify-center`}>
                        <TotalAssessmentContent chartData={assessmentChartData} />
                        <PieChartC />
                    </div>

                    {/* Chart based on program selection */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            {t("Program-Specific Radar Chart")}
                        </h3>
                        <select
                            id="program-select"
                            value={selectedProgram}
                            onChange={handleProgramChange}
                            className="w-full p-2 border border-black rounded-md dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">{t("Select a Program")}</option>
                            {programData.map((program, index) => (
                                <option key={index} value={program.programId}>
                                    {program.programName}
                                </option>
                            ))}
                        </select>
                        <div className="mt-6">
                            {selectedProgram ? (
                                <RadarChartC data={radarChartData} />
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">{t("Please select a program to view the chart.")}</p>
                            )}
                        </div>
                    </div>

                    <div className="max-w-fit p-4 bg-white/70 dark:bg-gray-600 backdrop-blur-md shadow-blue-100 rounded-2xl shadow-sm items-center mt-10 overflow-auto">
                        {/* Pass userData and reportData as usual */}
                        <TanStackTable userData={userData} reportData={mergedReportData} refreshData={refreshData} />
                    </div>

                </div>
            </div>

            {/* PDF Preview Modal */}
            {showPdfPreview && (
                <Modal
                    title="PDF Preview"
                    isOpen={showPdfPreview}
                    onClose={() => setShowPdfPreview(false)}
                    size="xl"
                >
                    <div className="p-4">
                        <div className="mb-4">
                            <PDFDownload simpleData={simpleSummary} reportData={reportData} tableData={tableData} />
                        </div>
                        <div className="h-[70vh]">
                            <PDFPreview simpleData={simpleSummary} reportData={reportData} tableData={tableData} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 p-4">
                        <button
                            onClick={() => setShowPdfPreview(false)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Laporan;

// import useFetchResults, { UserData, ReportDocument } from "@/hooks/useFetchResults";
//const { reportData, userData } = useFetchResults();

// const [reportData] = useState<ReportDataType>({
//     assessmentCount: 456,
//     registeredPrograms: 1234,
//     activeUsers: 567,
// });

// Function to get data from your table component
// const fetchTableData = (): TableDataRow[] => {
//     // This is where you would extract data from your TanStackTable
//     // For demonstration purposes, we're creating mock data
//     return [
//         { program: 'Computer Science', status: 'Active', date: '2025-03-15' },
//         { program: 'Mechanical Engineering', status: 'Pending', date: '2025-03-16' },
//         { program: 'Electrical Engineering', status: 'Completed', date: '2025-03-14' },
//     ];
// };