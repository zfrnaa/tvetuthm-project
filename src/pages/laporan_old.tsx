"use client"

import { useState, useRef } from "react";
import ReportCard from "../components/ui/ReportCard";
import TanStackTable from "@/components/TanStackTable";
import { RadarChartC, PieChartC, TotalAssessmentContent } from "@/components/CollectionGraph";
import { useTranslation } from "react-i18next";
import { useWindowDimensionsContext } from "@/lib/contexts/useWindowDimensionsContext";

const Laporan = () => {
    const [reportData] = useState({
        assessmentCount: 456,
        registeredPrograms: 1234,
        activeUsers: 567,
    });

    const chartRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const { isMobile } = useWindowDimensionsContext();

    return (
        <div className="min-h-screen max-w-fit overflow-x-auto">
            <div className="px-8 py-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t("Data Report and Assessment")}</h2>
                </div>

                {/* Report Cards */}
                <div className={`grid mt-6 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
                    <ReportCard title="Jumlah Penilaian" value={reportData.assessmentCount.toString()} />
                    <ReportCard title="Program Berdaftar" value={reportData.registeredPrograms.toString()} />
                    <ReportCard title="Pengguna Aktif" value={reportData.activeUsers.toString()} />
                </div>

                {/* Chart Section */}
                <div ref={chartRef} className={`bg-white dark:bg-gray-600 p-4 rounded-lg shadow mt-6 ${isMobile ? "flex-col" : "flex flex-row"} backdrop-blur-md shadow-blue-100 shadow-sm gap-6 w-full overflow-hidden justify-items-center`}>
                    <TotalAssessmentContent/>
                    <RadarChartC />
                    <PieChartC />
                </div>
                <div className="max-w-fit p-4 bg-white/50 dark:bg-gray-600 backdrop-blur-md shadow-blue-100 rounded-2xl shadow-sm items-center mt-10 overflow-auto scrollbar-medium scrollbar-track-gray-200 scrollbar-thumb-gray-400">
                    <TanStackTable />
                </div>
            </div>
        </div>
    );
};

export default Laporan;
