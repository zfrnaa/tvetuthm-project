import React from "react";
import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import Header from "../../components/ui/Header";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;

const AboutSistem: React.FC = () => {
    const { t, i18n } = useTranslation();

    return (
        <View className="flex-1 bg-white">
            <LinearGradient colors={["#F3F3F3", "#D7E1F3"]} className="absolute inset-0" />

            <Header />

            <ScrollView className="px-6 py-4">

                <View className="flex flex-row">
                    <View className="flex-1 w-1/2 pr-4">
                        {/* Title Section */}
                        <Text className="text-3xl font-bold text-black mt-6">{t("About Us")}</Text>
                        <Text className="text-base text-gray-600 mt-2 text-justify">
                            <Text className="font-bold text-blue-800">{t("TVET Assessment Program System")}</Text>
                            {t("is a system developed to assess the effectiveness of TVET programs based on the CIPP Model and key assessment clusters. This system provides comprehensive monitoring and analysis of program implementation, identifying strengths and areas for improvement.")}
                            {/* {t("adalah sistem yang dibangunkan untuk menilai keberkesanan program TVET berdasarkan Model CIPP dan kluster penilaian utama. Sistem ini membolehkan pemantauan dan analisis menyeluruh terhadap pelaksanaan program, mengenal pasti kekuatan serta aspek yang memerlukan penambahbaikan.")} */}
                        </Text>
                        <Text className="text-base text-gray-600 mt-2 text-justify">
                            {t("Dengan menggunakan pendekatan berstruktur, sistem ini menilai Konteks (Context), Input, Proses (Process), dan Produk (Product) dalam program TVET, memastikan setiap aspek diambil kira untuk meningkatkan kualiti pendidikan dan latihan vokasional.")}
                        </Text>
                        <Text className="text-base text-gray-600 mt-2 text-justify">
                            {("Dengan adanya sistem ini, diharapkan program TVET dapat terus berkembang, selaras dengan keperluan industri dan keperluan tenaga kerja masa hadapan.")}
                        </Text>
                    </View>
                    {/* Image Section */}
                    <View className="flex-2 mt-6 items-center w-1/2">
                        <Image source={require("../../assets/images/tvet_about.jpg")} className="rounded-lg" style={{ width: screenWidth - 800, height: screenWidth - 1000, objectFit: "cover" }} />
                    </View>
                </View>
                {/* Mission Section */}
                <View className="mt-8 items-center">
                    <Text className="text-2xl font-bold text-black text-center">Misi Kami</Text>
                    <Text className="text-base text-gray-600 mt-2 text-justify w-1/2">
                        {t("Kami komited untuk meningkatkan kualiti program TVET dengan menilai keberkesanannya berdasarkan model CIPP. Melalui pendekatan sistematik, kami membantu institusi TVET dalam membuat penambahbaikan berterusan.")}
                    </Text>
                </View>

                {/* Vision Section */}
                <View className="mt-8 items-center">
                    <Text className="text-2xl font-bold text-black text-center">Visi Kami</Text>
                    <Text className="text-base text-gray-600 mt-2 text-justify w-1/2">
                        {t("Membentuk ekosistem TVET yang lebih efektif, inovatif, dan relevan dengan keperluan industri serta memastikan graduan bersedia menghadapi cabaran kerjaya.")}
                    </Text>
                </View>

                {/* CIPP Model */}
                <View className="mt-8 items-center">
                    <Text className="text-2xl font-bold text-black text-center">Model CIPP</Text>
                    <Text className="text-base text-gray-600 mt-2 text-center w-1/2">
                        {t("Model CIPP adalah kerangka penilaian komprehensif yang terdiri daripada:")}
                    </Text>
                    <View className="mt-2 pl-4">
                        <Text className="text-base text-gray-600">• Context: Menilai keperluan, masalah, dan peluang</Text>
                        <Text className="text-base text-gray-600">• Input: Menilai pendekatan alternatif, strategi, dan rancangan</Text>
                        <Text className="text-base text-gray-600">• Process: Menilai pelaksanaan aktiviti</Text>
                        <Text className="text-base text-gray-600">• Product: Menilai hasil dan impak program</Text>
                    </View>
                </View>

                {/* Key Clusters */}
                <View className="mt-8 items-center">
                    <Text className="text-2xl font-bold text-black text-center">Kluster Penilaian</Text>
                    <View className="mt-2 pl-4">
                        <Text className="text-base text-gray-600 ">• Jaringan Industri: Menilai hubungan dan kerjasama dengan industri.</Text>
                        <Text className="text-base text-gray-600">• Pembangunan & Penyampaian Kurikulum: Menilai keberkesanan kurikulum.</Text>
                        <Text className="text-base text-gray-600">• Kualiti Tenaga Pengajar & Sumber TVET: Menilai kompetensi pengajar dan fasiliti.</Text>
                        <Text className="text-base text-gray-600">• Akreditasi & Pengiktirafan: Menilai status akreditasi program.</Text>
                        <Text className="text-base text-gray-600">• Kebolehpasaran Graduan: Menilai kadar kebolehpasaran graduan.</Text>
                    </View>
                </View>

                {/* Spacer */}
                <View className="h-12" />
            </ScrollView>
        </View>
    );
};

export default AboutSistem;
