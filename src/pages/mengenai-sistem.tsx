import React from "react";
import { useTranslation } from "react-i18next";

const AboutSistem: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen">
            <div className="px-6 py-4">
                <div className="flex flex-wrap mt-4">
                    <div className="w-1/2 pr-4">
                        <h1 className="text-3xl font-bold text-black dark:text-darkText">{t("About Us")}</h1>
                        <p className="text-base text-gray-600 dark:text-gray-400 mt-2 text-justify">
                            <strong className="text-blue-800 dark:text-darkTextSecondary">{t("TVET Assessment Program System")}</strong> {t("intro_1")}
                        </p>
                        <p className="text-base text-gray-600 dark:text-gray-400 mt-2 text-justify">{t("intro_2")}</p>
                        <p className="text-base text-gray-600 dark:text-gray-400 mt-2 text-justify">{t("intro_3")}</p>
                    </div>
                    <div className="w-1/2 flex justify-center">
                        <img src="src/assets/images/tvet_about.jpg" className="rounded-lg w-180" alt="TVET About" />
                    </div>
                </div>

                <div className="flex flex-wrap mt-6">
                    <div className="w-1/2 rounded-lg">
                        <img src="src/assets/images/misvision.jpg" className="rounded-lg shadow-md shadow-blue-200 w-180" alt="Mission Vision" />
                    </div>
                    <div className="w-1/2 flex flex-col justify-center items-center">
                        <div className="mt-8 text-center ">
                            <h2 className="text-2xl font-bold text-black dark:text-darkText">{t("Mission")}</h2>
                            <p className="text-base text-gray-600 dark:text-gray-400 mt-2 px-4">{t("mission_det")}</p>
                        </div>
                        <div className="mt-8 text-center">
                            <h2 className="text-2xl font-bold text-black dark:text-darkText">{t("Vision")}</h2>
                            <p className="text-base text-gray-600 dark:text-gray-400 mt-2 px-4">{t("vision_det")}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <h2 className="text-2xl font-bold text-black dark:text-darkText">{t("CIPP Model")}</h2>
                    <p className="text-base text-gray-600 mt-2 w-1/2 mx-auto dark:text-gray-400">{t("CIPPM_desc")}</p>
                    <ul className="mt-2 text-gray-600 dark:text-gray-400">
                        <li>• {t("CIPP_desc1")}</li>
                        <li>• {t("CIPP_desc2")}</li>
                        <li>• {t("CIPP_desc3")}</li>
                        <li>• {t("CIPP_desc4")}</li>
                    </ul>
                </div>

                <div className="mt-8 text-center">
                    <h2 className="text-2xl font-bold text-black dark:text-darkText">{t("Assessment Cluster")}</h2>
                    <ul className="mt-2 text-gray-600 dark:text-gray-400">
                        <li>• {t("Jaringan Industri: Menilai hubungan dan kerjasama dengan industri.")}</li>
                        <li>• {t("Pembangunan & Penyampaian Kurikulum: Menilai keberkesanan kurikulum.")}</li>
                        <li>• {t("Kualiti Tenaga Pengajar & Sumber TVET: Menilai kompetensi pengajar dan fasiliti.")}</li>
                        <li>• {t("Akreditasi & Pengiktirafan: Menilai status akreditasi program.")}</li>
                        <li>• {t("Kebolehpasaran Graduan: Menilai kadar kebolehpasaran graduan.")}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AboutSistem;
