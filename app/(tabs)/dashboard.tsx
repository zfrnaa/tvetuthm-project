import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/ui/Header";
import Card from "../../components/ui/Card";
import CalendarComponent from "@/components/Calendar";
import CardWChart from "@/components/ui/CardWChart";
import { ChartNoAxesColumnIcon, GraduationCap, Star } from "lucide-react-native";
import { Provider } from "react-native-paper";
import { account } from "@/lib/appwrite";
import { useTranslation } from "react-i18next";
import { useFonts } from "expo-font";
import { TotalAssessmentContent, HighestRatedProgramContent, TotalRegisteredProgramsContent, TAssessmentContentMini } from "@/components/dashbMContent";

const Dashboard: React.FC = () => {

  const [fontsLoaded, fontError] = useFonts({
    'GeistSans-Regular': require('../../assets/fonts/GeistSans/Geist-Regular.ttf'),
    'GeistSans-Medium': require('../../assets/fonts/GeistSans/Geist-Medium.ttf'),
    'GeistSans-Bold': require('../../assets/fonts/GeistSans/Geist-Bold.ttf'),
    'GeistMono-Light': require('../../assets/fonts/GeistMono/GeistMono-Light.ttf'),
    'GeistMono-Regular': require('../../assets/fonts/GeistMono/GeistMono-Regular.ttf'),
    'GeistMono-Medium': require('../../assets/fonts/GeistMono/GeistMono-Medium.ttf'),
    'GeistMono-Bold': require('../../assets/fonts/GeistMono/GeistMono-Bold.ttf'),
  });

  const [userName, setUserName] = useState<string>("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        i18n.changeLanguage("ms"); // Set Malay as default
        const user = await account.get();
        setUserName(user.name || "Pengguna"); // Fallback to "Pengguna" if no name found
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  // Split name into words
  const nameParts = userName.split(" ");

  return (
    <Provider>
      <View className="flex-1 relative">
        <LinearGradient colors={["#F3F3F3", "#C5D3ED"]} className="absolute inset-0" />
        <Header />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="flex flex-row gap-6 mb-8 px-4 min-h-screen">
            <View className="flex-1 w-1/5 flex-row gap-6">
              {/* Left Section */}
              <View className="flex-1">
                <Text className="font-geistMonoRegular text-lg text-gray-500">{i18n.t('Welcome')}</Text>
                {nameParts.map((part, index) => (
                  <Text key={index} className="text-4xl font-geistSansBold font-bold">
                    {part}
                  </Text>
                ))}
                <Text className="text-lg font-medium text-gray-600">{i18n.t("to")}</Text>
                <Text className="text-4xl font-bold font-geistSansBold">{t("tvet_program_title")}</Text>
              </View>

              {/* Middle Section - Ringkasan Penilaian */}
              <View className="flex-2 p-4 rounded-2xl bg-white/50 backdrop-blur-md shadow-sm shadow-blue-100 mb-8 h-dvw">
                <Text className="text-md font-semibold mb-4 text-gray-700 font-geistMonoLight">
                  {t("Assessment Summary")}
                </Text>

                <View className="grid grid-cols-2 gap-6">

                  <CardWChart title={t("Total Assessment Done")} content="123" subtitle={t("This Month")} icon={<ChartNoAxesColumnIcon size={24} />} graph={<TAssessmentContentMini/>} modalContent={<TotalAssessmentContent/>} />
                  <CardWChart title={t("Highest Rated Program") + " (5⭐)"} content="Program XYZ" subtitle="#1" icon={<Star size={24} />} modalContent={<HighestRatedProgramContent/>}/>
                  <CardWChart title={t("Total Registered Program")} content="1235" subtitle="2025" icon={<GraduationCap size={24} />} modalContent={<TotalRegisteredProgramsContent/>} />
                </View>
              </View>

              {/* Right Section - Akan Datang & Calendar */}
              <View className="flex-1/5 p-4 rounded-2xl bg-white/50 backdrop-blur-md shadow-sm shadow-blue-100 mb-8">
                <View className="grid grid-cols-1 gap-6">
                  <Card title={t("Upcoming")} content={t("Next Assessment")} />
                  <CalendarComponent />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
};

export default Dashboard;