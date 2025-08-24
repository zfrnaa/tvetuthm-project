import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Building2, BookOpen, User, Shield, GraduationCap } from "lucide-react";
import { useResults } from "@/hooks/useResults";
import { usePrograms } from "@/hooks/usePrograms";
import { generateAreaChartData } from "@/components/data-display/charts/Generate-Area-Chart";
import { getCompletedAtDate } from "../src/lib/utils/convertTimestamp";
import { clusterNameToId } from "./clusterNameToId";

export const useDashboardData = () => {

    // Fetch data from hooks
    const { data: resultsData, isLoading: resultsLoading } = useResults();
    const { data: programsData, isLoading: programsLoading } = usePrograms();

    // Total registered programs
    const totalProgram = useMemo(() => programsData?.length || 0, [programsData]);

    // Filter evaluated programs (starRating > 0)
    const evaluatedPrograms = useMemo(() => {
        return programsData?.filter((program) => program.starRating && program.starRating > 0) || [];
    }, [programsData]);

    // Compute highest rated program based on starRating.
    const highestRatedProgram = useMemo(() => {
        if (evaluatedPrograms.length > 0) {
            return [...evaluatedPrograms].sort((a, b) => Number(b.starRating) - Number(a.starRating))[0];
        }
        return null;
    }, [evaluatedPrograms]);

    // Firebase implementation
    const assessmentChartData = useMemo(() => {
        if (resultsData && Array.isArray(resultsData)) {
            const now = new Date();
            const data = [];
            // For the last 5 months
            for (let i = 4; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthLabel = d.toLocaleString("default", { month: "short" });
                const count = resultsData.filter((report) => {
                    // Handle Firebase Timestamp or string date format
                    const reportDate = getCompletedAtDate(report.completed_at); // Fallback for string

                    return reportDate.getMonth() === d.getMonth() && reportDate.getFullYear() === d.getFullYear();
                }).length;
                data.push({ month: monthLabel, User: count });
            }
            return data;
        }
        return generateAreaChartData();
    }, [resultsData]);

    const clusterData = useMemo(() => {
        if (!resultsData || resultsData.length === 0) return [];

        //get the latest result from resultsData
        const latestResult = [...resultsData].sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0];

        // take the clusterScores from latestresultsData
        const rawClusterScores = (latestResult?.clusterScores || {}) as Record<string, [number, number]>;

        // Predefined cluster names, icons, and colors
        const predefinedClusters = [
            {
                id: "industry-network",
                name: "Jaringan Industri",
                icon: Building2,
                color: "bg-slate-700 dark:bg-cyan-900",
                description: "Perkongsian industri dan rangkaian kerjasama",
                metrics: [
                    { name: "Perkongsian Industri"},
                    { name: "Penglibatan Industri" },
                    { name: "Projek Kerjasama" },
                ],
            },
            {
                id: "curriculum",
                name: "Pembangunan & Penyampaian Kurikulum",
                icon: BookOpen,
                color: "bg-indigo-600 dark:bg-cyan-900",
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
                color: "bg-purple-700 dark:bg-cyan-900",
                description: "Kelayakan pengajar dan sumber pengajaran",
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
                color: "bg-rose-600 dark:bg-cyan-900",
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
                color: "bg-pink-600 dark:bg-cyan-900",
                description: "Kadar pekerjaan siswazah dan hasil kerjaya",
                metrics: [
                    { name: "Kadar Pekerjaan" },
                    { name: "Penempatan Industri" },
                    { name: "Kemajuan Kerjaya" },
                ],
            },
        ];

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
    }, [resultsData]);

    // Dynamic recent assessments
    const recentAssessments = useMemo(() => {
        if (!resultsData || !programsData) return [];
        return resultsData.map((result) => {
            const matchedProgram = programsData.find(
                (program) => program.programId === result.programId
            );
            return {
                programs: matchedProgram?.programName || "Program Tidak Diketahui",
                date: getCompletedAtDate(result.completed_at).toLocaleDateString(),
                status: "Selesai",
                score: result.totalScore || 0,
            };
        });
    }, [resultsData, programsData]);

    const recentAssessmentColumns: ColumnDef<typeof recentAssessments[number]>[] = useMemo(() => [
        {
            header: "Program",
            accessorKey: "programs",
        },
        {
            header: "Tarikh",
            accessorKey: "date",
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: info => (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {info.getValue<string>()}
                </span>
            ),
        },
        {
            header: "Skor",
            accessorKey: "score",
            cell: info => (
                <span className="font-medium">{info.getValue<number>()}</span>
            ),
        },
    ], []);

    return {
        clusterData,
        assessmentChartData,
        totalProgram,
        evaluatedPrograms,
        highestRatedProgram,
        recentAssessments,
        recentAssessmentColumns,
        isLoading: programsLoading || resultsLoading,
    };
}