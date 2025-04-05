import { CardWChart } from "../components/ui/CardWChart";
import { useEffect, useMemo, useState } from "react";
const { useTranslation } = await import("react-i18next");
const { ChartNoAxesColumnIcon, GraduationCap, Star } = await import("lucide-react");
const { TotalAssessmentContent, TotalAssessmentContentMini } = await import("@/components/CollectionGraph");
import { useWindowDimensionsContext } from "@/lib/contexts/useWindowDimensionsContext";
import { WelcomeGreeting } from "@/components/Greetings";
import {
  Card,
  CardHeader,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsPanel
} from "@material-tailwind/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { CardContent } from "@mui/material";
import { Button } from "@headlessui/react";
import { useDashboardData } from "../../model/dashboardData";
import { Progress } from "../components/ui/progress";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { EvaluatedProgram, AllPrograms } from "@/components/ProgramFetch";
import { usePrograms } from "@/hooks/usePrograms";
import { LoadingGeneral } from "@/components/ui/loading";
import { generateAreaChartData } from "@/components/generateAreaChartData";
import { useResults } from "@/hooks/useResults";
import { getProgrammeById } from "../../model/listOfProgramName";

const Dashboard = () => {
  const { isMobile } = useWindowDimensionsContext();
  const { t } = useTranslation();
  const [isLoading, setisLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const { clusterData, recentAssessments, recentAssessmentColumns } = useDashboardData();

  const { data: fetchResults, } = usePrograms();
  console.log("Fetched Programs:", fetchResults);
  const totalProgram = fetchResults?.length || 0;

  // NEW: Get assessment data from real results.
  const { data: resultsData, isLoading: resultsLoading } = useResults();

  // Filter evaluated programs (starRating > 0)
  const evaluatedPrograms = fetchResults?.filter(
    (program) => program.starRating && program.starRating > 0
  ) || [];

  // Compute monthly assessment totals for the last 6 months.
  const assessmentChartData = useMemo(() => {
    if (resultsData && Array.isArray(resultsData)) {
      const now = new Date();
      const data = [];
      // For the last 5 months (adjust the loop if needed)
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

  // Compute highest rated program based on starRating.
  const highestRatedProgram =
    fetchResults && fetchResults.length > 0
      ? [...evaluatedPrograms].sort(
        (a, b) => Number(b.starRating) - Number(a.starRating)
      )[0]
      : null;

  const highestRatedProgramShortName = highestRatedProgram
    ? getProgrammeById(highestRatedProgram.programId)?.shortName || t("N/A")
    : t("N/A");

  useEffect(() => {
    const timer = setTimeout(() => {
      setisLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [])

  // Create the table instance
  const recentAsmtTable = useReactTable({
    data: recentAssessments,
    columns: recentAssessmentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading || resultsLoading) return <LoadingGeneral />;

  return (
    <div className="w-full mx-auto py-6 px-8 transition-all duration-300">
      <div className="grid gap-4 md:gap-8">
        <div className="relative z-10">
          <WelcomeGreeting />
        </div>
        <div className="flex flex-row gap-6">
          {/* Section: Assessment Summary */}
          <div className="flex flex-col w-full">
            <h2 className="text-xl gantariBold text-gray-700 dark:text-gray-400 mb-4">
              {t("Assessment Summary")}
            </h2>
            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-4`}>
              <CardWChart
                title={t("Total Assessment Done")}
                icon={<ChartNoAxesColumnIcon size={24} />}
                content={resultsData?.length || 0}
                subtitle={t("Month")}
                graph={<TotalAssessmentContentMini chartData={assessmentChartData} />}
                modalContent={<TotalAssessmentContent chartData={assessmentChartData} />}
              />
              <CardWChart
                title={t("Total Registered Program")}
                icon={<GraduationCap size={24} fill="fff" />}
                content={totalProgram.toString()}
                subtitle={new Date().getFullYear().toString()}
                modalContent={<AllPrograms programs={fetchResults || []} />}
              />
              <CardWChart
                title={t("Highest Rated Program") + " (5⭐)"}
                icon={<Star size={24} />}
                content={
                  t(highestRatedProgramShortName)
                }
                // content={t("Construction Technology")}
                subtitle="#1"
                modalContent={<EvaluatedProgram programs={fetchResults || []} />}
              />
            </div>
          </div>
        </div>
        <p className="text-lg montserratBold">{t("Latest Evaluated Programs")}</p>
        {/* Section: Cluster Overview */}
        <div className="flex gap-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 flex-col">
            <TabsList className="bg-blue-100 dark:bg-gray-700 w-fit">
              <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
              <TabsTrigger value="details">{t("Cluster Details")}</TabsTrigger>
              <TabsTrigger value="recent">{t("Recent Assessment")}</TabsTrigger>
            </TabsList>
            {activeTab === "overview" && (
              <TabsPanel value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  {clusterData.map((cluster) => (
                    <Card key={cluster.id} className="overflow-hidden">
                      <CardHeader className={`${cluster.color} text-white p-4 lg:h-[170px] md:h-[140px] sm:h-[100px] items-center`}>
                        <div className="flex justify-between">
                          <cluster.icon className="h-6 w-6" />
                          <span className="text-2xl font-bold">{cluster.score}%</span>
                        </div>
                        <CardTitle className="text-white text-lg text-wrap">{cluster.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="h-16">{cluster.description}</CardDescription>
                        <Button
                          className="mt-2 w-full"
                          onClick={() => setActiveTab("details")}
                        >
                          {t("View Details")}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="p-2">
                  <CardHeader>
                    <CardTitle>{t("Overall PQuality")}</CardTitle>
                    <CardDescription>
                      {t("overall_pgm_desc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-3xl font-bold">81.4%</span>
                          <span className="text-sm text-muted-foreground">
                            {t("Overall QScore")}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last updated: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {clusterData.map((cluster) => (
                          <div key={cluster.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <cluster.icon className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {cluster.name}
                                </span>
                              </div>
                              <span className="text-sm font-medium">
                                {cluster.score}%
                              </span>
                            </div>
                            <Progress value={cluster.score} className="h-4" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsPanel>
            )
            }
            {activeTab === "details" && (

              <TabsPanel value="details" className="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusterData.map((cluster) => (
                  <Card key={cluster.id} className="p-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <cluster.icon className="h-5 w-5" />
                          {cluster.name}
                        </CardTitle>
                        <CardDescription>{cluster.description}</CardDescription>
                      </div>
                      <div className={`${cluster.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                        {cluster.score}%
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {cluster.metrics.map((metric, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{metric.name}</span>
                              <span className="text-sm font-medium">{metric.value}%</span>
                            </div>
                            <Progress value={metric.value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsPanel>
            )}
            {activeTab === "recent" && (

              <TabsPanel value="recent" className="space-y-4">
                <Card className="p-2">
                  <CardHeader>
                    <CardTitle>Recent Programme Assessments</CardTitle>
                    <CardDescription>
                      Latest completed programme quality assessments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border min-w-fit overflow-x-auto scrollbar-medium scrollbar-track-gray-200 scrollbar-thumb-gray-400">
                      <table className="min-w-[500px] border-collapse">
                        <thead>
                          {recentAsmtTable.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-muted">
                              {headerGroup.headers.map(header => (
                                <th key={header.id} className="p-3 text-sm font-medium">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody>
                          {recentAsmtTable.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-t">
                              {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="p-3 text-sm">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsPanel>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;