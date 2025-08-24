import { CardWChart } from "../components/ui/cards/CardWChart";
import { useEffect, useMemo, useState } from "react";
const { ChartNoAxesColumnIcon, GraduationCap, Star } = await import("lucide-react");
const { TotalAssessmentContent, TotalAssessmentContentMini } = await import("@/components/data-display/charts/Collection-Graph");
import { useWindowDimensionsContext } from "@/lib/contexts/useWindowDimensionsContext";
import { EvaluatedProgram, AllPrograms } from "@/components/programs/ProgramFetch";
import { usePrograms } from "@/hooks/usePrograms";
import { WelcomeGreeting } from "@/components/ui/special/Greetings";
import { useDashboardData } from "../../model/dashboardData";
import { getProgrammeById, programmes } from "../../model/listOfProgramName";
import { LoadingGeneral } from "@/components/ui/feedback/loading";
import { Tabs, TabsList, TabsTrigger } from "@material-tailwind/react";
import { EvaluatedProgramTabs } from "@/components/programs/LatEvalProgram";
import { cleanProgramName } from "@/lib/utils/cleanProgramName";

const Dashboard = () => {
  const { isMobile } = useWindowDimensionsContext();
  const { assessmentChartData, evaluatedPrograms,
    highestRatedProgram, totalProgram, recentAssessments, isLoading: dataLoading } = useDashboardData();
  const { data: allPrograms } = usePrograms();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const highestRatedProgramShortName = useMemo(() => {
    if (!highestRatedProgram) {
      return "N/A";
    }

    // 1. Try finding by ID
    let program = getProgrammeById(highestRatedProgram.programId);
    if (program) {
      return program.shortName;
    }

    // 2. Try finding by full name (assuming highestRatedProgram has a 'programName' field)
    const fullName = (highestRatedProgram as any).programName;
    if (fullName && typeof fullName === 'string') {
      program = programmes.find(p => p.name.toLowerCase() === fullName.toLowerCase());
      if (program) {
        return program.shortName;
      }
      // 3. Clean the full name as a fallback if not found by name
      return cleanProgramName(fullName);
    }

    // 4. If only ID was present and not found, return N/A
    return "N/A";

  }, [highestRatedProgram]);

  // Get the latest evaluated program name
  const latestProgramName = useMemo(() => {
    // if (recentAssessments.length > 0) {
    if (recentAssessments.length === 0) {
      return "Program Tidak Diketahui";
    }
    const getMs = (d: any): number => {
      // Firestore Timestamp?
      if (typeof d?.seconds === "number" && typeof d?.nanoseconds === "number") {
        return d.seconds * 1000 + d.nanoseconds / 1e6;
      }

      if (typeof d?.toDate === "function") {
        return d.toDate().getTime();
      }
      // string | Date | other
      const dt = typeof d === "string"
        ? new Date(d)
        : d instanceof Date
          ? d
          : new Date(d);
      return isNaN(dt.getTime()) ? 0 : dt.getTime();
    };

    const latestAssessment = recentAssessments.reduce((prev, curr) =>
      getMs(curr.date) > getMs(prev.date) ? curr : prev
    );
    return latestAssessment.programs;
    // }

  }, [recentAssessments]);

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
              Ringkasan Penilaian
            </h2>
            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-4`}>
              <CardWChart
                title="Jumlah Penilaian Dibuat"
                icon={<ChartNoAxesColumnIcon size={24} />}
                content={recentAssessments?.length || 0}
                subtitle="Bulan Ini"
                graph={<TotalAssessmentContentMini chartData={assessmentChartData} />}
                modalContent={<TotalAssessmentContent chartData={assessmentChartData} />}
              />
              <CardWChart
                title="Jumlah Program Berdaftar"
                icon={<GraduationCap size={24} fill="fff" />}
                content={totalProgram.toString()}
                subtitle={new Date().getFullYear().toString()}
                modalContent={<AllPrograms programs={allPrograms || []} />}
                modalTitle="Semua Program"
              />
              <CardWChart
                title="Program Penarafan Terbaik 5⭐"
                icon={<Star size={24} />}
                content={highestRatedProgramShortName}
                subtitle="#1"
                modalContent={<EvaluatedProgram programs={evaluatedPrograms || []} />}
                modalTitle="Program Dinilai"
              />
            </div>
          </div>
        </div>
        {/* Section Header with Tabs */}
        <div className="flex items-center justify-between gap-4 mt-4"> {/* Use flex to align items */}
          <p className="text-lg montserratBold">Program Terkini Dinilai</p>
          {/* Render TabsList and Triggers here */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit"> {/* Wrap in Tabs for context */}
            <TabsList className="bg-white dark:bg-gray-700">
              <TabsTrigger value="overview">Gambaran</TabsTrigger>
              <TabsTrigger value="details">Butiran</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* display the latest evaluated program name */}
        <p className="text-sm text-muted-foreground">{latestProgramName}</p>

        {/* Section: Cluster Overview */}
        <div className="flex gap-6">
          <EvaluatedProgramTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;