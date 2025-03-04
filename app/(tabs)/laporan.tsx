import React from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "../../components/ui/Header";
import ReportCard from "../../components/ui/ReportCard";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
        {
            data: [20, 45, 80, 43],
            color: (opacity = 1) => `rgba(52, 75, 253, ${opacity})`,
            strokeWidth: 2,
        },
    ],
};

const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
        r: "4",
        strokeWidth: "1",
        stroke: "#344BFD",
    },
    propsForBackgroundLines: {
        display: "none",
    },
};

// const [fontsLoaded] = useFonts({
//     'GeistSans-Regular': require('./assets/fonts/GeistSans/Geist-Regular.ttf'),
//     'GeistSans-Medium': require('./assets/fonts/GeistSans/Geist-Medium.ttf'),
//     'GeistSans-Bold': require('./assets/fonts/GeistSans/Geist-Bold.ttf'),
//     'GeistMono-Regular': require('./assets/fonts/GeistMono/GeistMono-Regular.ttf'),
//     'GeistMono-Medium': require('./assets/fonts/GeistMono/GeistMono-Medium.ttf'),
//     'GeistMono-Bold': require('./assets/fonts/GeistMono/GeistMono-Bold.ttf'),
// });

const Laporan: React.FC = () => (

    <View className="flex-1 bg-gray-100">
        <LinearGradient colors={["#F3F3F3", "#D7E1F3"]} className="absolute inset-0" />
        <Header />
        <ScrollView className="p-4">
            <View className="px-4">
                {/* Title Section */}
                <Text className="text-lg font-semibold text-gray-500">
                    Laporan lengkap mengenai data dan penilaian
                </Text>

                {/* Report Summary Section */}
                <View className="flex flex-row flex-wrap justify-start mt-6 gap-6">
                    <ReportCard title="Jumlah Penilaian" value="456" icon="📊" />
                    <ReportCard title="Program Berdaftar" value="1,234" icon="📌" />
                    <ReportCard title="Pengguna Aktif" value="567" icon="👥" />
                </View>

                {/* Graph Section */}
                <View className="flex-row justify-between">
                    <View className="bg-white rounded-2xl p-4 mt-6 shadow-md shadow-blue-100 w-1/2 mr-2">
                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            Statistik Penilaian
                        </Text>
                        <LineChart
                            data={chartData}
                            width={(screenWidth / 2) - 24} // Ensure it fits half of the screen
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={{ paddingLeft: 0 }}
                        />
                    </View>

                    <View className="bg-white rounded-2xl p-4 mt-6 shadow-md shadow-blue-100 w-1/2 ml-2">
                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            Statistik Penilaian
                        </Text>
                        <LineChart
                            data={chartData}
                            width={(screenWidth / 2) - 24} // Same width for consistency
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={{ paddingLeft: 0 }}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>
);

export default Laporan;
