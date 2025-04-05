import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Building2, BookOpen, User, Shield, GraduationCap } from "lucide-react";
import { useResults } from "@/hooks/useResults";
import { usePrograms } from "@/hooks/usePrograms";
import { generateAreaChartData } from "@/components/generateAreaChartData";

export const useDashboardData = () => {
    const { t } = useTranslation();

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
    // const highestRatedProgram =
    //     programsData && programsData.length > 0
    //         ? [...evaluatedPrograms].sort(
    //             (a, b) => Number(b.starRating) - Number(a.starRating)
    //         )[0]
    //         : null;

    // Compute monthly assessment totals for the last 6 months
    const assessmentChartData = useMemo(() => {
        if (resultsData && Array.isArray(resultsData)) {
            const now = new Date();
            const data = [];
            // For the last 5 months (adjust if needed)
            for (let i = 4; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthLabel = d.toLocaleString("default", { month: "short" });
                const count = resultsData.filter((report) => {
                    const reportDate = new Date(report.completed_at);
                    return reportDate.getMonth() === d.getMonth() && reportDate.getFullYear() === d.getFullYear();
                }).length;
                data.push({ month: monthLabel, desktop: count, mobile: count });
            }
            return data;
        }
        return generateAreaChartData();
    }, [resultsData]);

    const clusterData = useMemo(() => [
        {
            id: "industry-network",
            name: t("Industry Networking"),
            icon: Building2,
            score: 78,
            color: "bg-yellow-500 dark:bg-cyan-900",
            description: t("Industry partnerships and collaboration networks"),
            metrics: [
                { name: t("Industry Partnerships"), value: 82 },
                { name: t("Industry Engagement"), value: 75 },
                { name: t("Collaborative Projects"), value: 68 },
            ],
        },
        {
            id: "curriculum",
            name: t("Curriculum Development & Delivery"),
            icon: BookOpen,
            score: 85,
            color: "bg-green-500 dark:bg-cyan-900",
            description: t("Curriculum design, content and delivery methods"),
            metrics: [
                { name: t("Curriculum Relevance"), value: 88 },
                { name: t("Teaching Methods"), value: 82 },
                { name: t("Learning Resources"), value: 85 },
            ],
        },
        {
            id: "instructors",
            name: t("Quality of TVET Instructors & Resources"),
            icon: User,
            score: 72,
            color: "bg-orange-500 dark:bg-cyan-900",
            description: t("Instructor qualifications and teaching resources"),
            metrics: [
                { name: t("Instructor Qualifications"), value: 75 },
                { name: t("Professional Development"), value: 68 },
                { name: t("Teaching Resources"), value: 73 },
            ],
        },
        {
            id: "accreditation",
            name: t("Accreditation & Recognition"),
            icon: Shield,
            score: 90,
            color: "bg-purple-500 dark:bg-cyan-900",
            description: t("Programme accreditation and industry recognition"),
            metrics: [
                { name: t("Accreditation Status"), value: 95 },
                { name: t("Industry Recognition"), value: 88 },
                { name: t("Quality Assurance"), value: 87 },
            ],
        },
        {
            id: "employability",
            name: t("Graduate Employability"),
            icon: GraduationCap,
            score: 82,
            color: "bg-rose-500 dark:bg-cyan-900",
            description: t("Graduate employment rates and career outcomes"),
            metrics: [
                { name: t("Employment Rate"), value: 85 },
                { name: t("Industry Placement"), value: 78 },
                { name: t("Career Progression"), value: 83 },
            ],
        },
    ], [t]);

    // const recentAssessments = useMemo(() => [
    //     {
    //         programme: t("Mechanical Engineering"),
    //         date: "15 Mar 2025",
    //         status: t("Completed"),
    //         score: 87,
    //     },
    //     {
    //         programme: t("Information Technology"),
    //         date: "12 Mar 2025",
    //         status: t("Completed"),
    //         score: 92,
    //     },
    //     {
    //         programme: t("Electrical Engineering"),
    //         date: "10 Mar 2025",
    //         status: t("Completed"),
    //         score: 84,
    //     },
    //     {
    //         programme: t("Civil Engineering"),
    //         date: "05 Mar 2025",
    //         status: t("Completed"),
    //         score: 79,
    //     },
    //     {
    //         programme: t("Automotive Technology"),
    //         date: "28 Feb 2025",
    //         status: t("Completed"),
    //         score: 81,
    //     },
    // ], [t]);
    // Dynamic recent assessments
    const recentAssessments = useMemo(() => {
        if (!resultsData) return [];
        return resultsData.map((result) => ({
            programme: programsData?.find((program) => program.programId === result.programId)?.programName || t("Unknown Program"),
            date: new Date(result.completed_at).toLocaleDateString(),
            status: t("Completed"),
            score: result.totalScore || 0,
        }));
    }, [resultsData, programsData, t]);

    const recentAssessmentColumns: ColumnDef<typeof recentAssessments[number]>[] = useMemo(() => [
        {
            header: t("Programme"),
            accessorKey: "programme",
        },
        {
            header: t("Date"),
            accessorKey: "date",
        },
        {
            header: t("Status"),
            accessorKey: "status",
            cell: info => (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {info.getValue<string>()}
                </span>
            ),
        },
        {
            header: t("Score"),
            accessorKey: "score",
            cell: info => (
                <span className="font-medium">{info.getValue<number>()}%</span>
            ),
        },
    ], [t]);

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