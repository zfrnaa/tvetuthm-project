import { CardWChart } from "../components/ui/CardWChart";
import { useEffect, useState } from "react";
const { useTranslation } = await import("react-i18next");
const { ChartNoAxesColumnIcon, GraduationCap, Star } = await import("lucide-react");
const { TotalAssessmentContent, TotalAssessmentContentMini } = await import("@/components/CollectionGraph");
import { useWindowDimensionsContext } from "@/lib/contexts/useWindowDimensionsContext";
import { WelcomeGreeting } from "@/components/Greetings";
import { useDashboardData } from "../../model/dashboardData";
import { EvaluatedProgram, AllPrograms } from "@/components/ProgramFetch";
import { LoadingGeneral } from "@/components/ui/loading";
import { getProgrammeById } from "../../model/listOfProgramName";
import { EvaluatedProgramTabs } from "@/components/EvaluatedProgramTabs";

const Dashboard = () => {
  const { isMobile } = useWindowDimensionsContext();
  const { t } = useTranslation();
  const { assessmentChartData, evaluatedPrograms,
    highestRatedProgram, totalProgram, recentAssessments, isLoading: dataLoading } = useDashboardData();

  const [isLoading, setIsLoading] = useState(true);

  const highestRatedProgramShortName = highestRatedProgram
    ? getProgrammeById(highestRatedProgram.programId)?.shortName || t("N/A")
    : t("N/A");

  useEffect(() => {
    if (!dataLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 700); // Simulate additional loading time
      return () => clearTimeout(timer);
    }
  }, [dataLoading]);

  if (isLoading) return <LoadingGeneral />;

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
                content={recentAssessments?.length || 0}
                subtitle={t("Month")}
                graph={<TotalAssessmentContentMini chartData={assessmentChartData} />}
                modalContent={<TotalAssessmentContent chartData={assessmentChartData} />}
              />
              <CardWChart
                title={t("Total Registered Program")}
                icon={<GraduationCap size={24} fill="fff" />}
                content={totalProgram.toString()}
                subtitle={new Date().getFullYear().toString()}
                modalContent={<AllPrograms programs={evaluatedPrograms || []} />}
              />
              <CardWChart
                title={t("Highest Rated Program") + " (5⭐)"}
                icon={<Star size={24} />}
                content={
                  t(highestRatedProgramShortName)
                }
                // content={t("Construction Technology")}
                subtitle="#1"
                modalContent={<EvaluatedProgram programs={evaluatedPrograms || []} />}
              />
            </div>
          </div>
        </div>
        <p className="text-lg montserratBold">{t("Latest Evaluated Programs")}</p>
        {/* Section: Cluster Overview */}
        <div className="flex gap-6">
          <EvaluatedProgramTabs />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;