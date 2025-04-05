import CardWChart from "../components/ui/CardWChart";
import CalendarComponent from "../components/Calendar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { useUser } from "../lib/contexts/hook"; // Use our updated UserContext
import { ChartNoAxesColumnIcon, GraduationCap, Star } from "lucide-react";
import { TotalAssessmentContent, TotalAssessmentContentMini } from "@/components/CollectionGraph";
import { useWindowDimensionsContext } from "@/lib/contexts/useWindowDimensionsContext";
import { WelcomeWithGreeting } from "@/components/Greetings";

const Dashboard = () => {
  // const { user, loading } = useUser(); // Get user data from our context
  const { isMobile } = useWindowDimensionsContext();
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Set default language
    i18n.changeLanguage("ms");
  }, [i18n]);

  // Split name into words for display
  // const nameParts = loading ? ["Pengguna"] : (user?.name || "Pengguna").split(" ");

  return (
    <div className="min-h-screen min-w-screen">
      <div className="px-8 py-2">
        <div className="flex flex-row gap-6 mt-6">
          {/* Left Section: Welcome Message */}
          <div className="flex-1 flex-col">
            <WelcomeWithGreeting />
            {/* <div>
              <h2 className="text-lg text-gray-700 dark:text-gray-300 gantariMd">{t("Welcome")}</h2>
              {nameParts.map((part, index) => (
                <h1 key={index} className="text-4xl font-bold text-accentCustom dark:text-darkText">
                  {part}
                </h1>
              ))}
              <p className="mt-2 text-lg text-gray-700 dark:text-gray-300 gantariMd">{t("to")}</p>
              <p className="text-2xl font-bold text-accentCustom dark:text-darkText">{t("tvet_program_title")}</p>
            </div> */}
            {/* Calendar Section */}
            <div className="max-w-80 mt-8">
              {isMobile ? (
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full p-4 bg-white/65 dark:bg-gray-700 shadow-sm rounded-lg backdrop-blur-md flex items-center justify-between"
                  >
                    <span className="text-lg font-semibold">{t("Calendar")}</span>
                    <span>📅</span>
                  </button>

                  {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md max-h-[60vh] overflow-auto">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">{t("Calendar")}</h3>
                          <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                          >
                            ✕
                          </button>
                        </div>
                        <CalendarComponent />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <CalendarComponent />
              )}
            </div>
          </div>

          {/* Middle Section: Assessment Summary */}
          <div className="flex-5 flex-col flex-nowrap">
            <h2 className="text-xl gantariBold text-gray-700 dark:text-gray-400 mb-4">{t("Assessment Summary")}</h2>
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
              <CardWChart title={t("Total Assessment Done")} icon={<ChartNoAxesColumnIcon size={24} />} content="123" subtitle={t("This Month")} graph={<TotalAssessmentContentMini />} modalContent={<TotalAssessmentContent />} />
              <CardWChart title={t("Total Registered Program")} icon={<GraduationCap size={24} fill="fff" />} content="1235" subtitle="2025" />
              <CardWChart title={t("Highest Rated Program") + " (5⭐)"} icon={<Star size={24} />} content={t("Construction Technology")} subtitle="#1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;