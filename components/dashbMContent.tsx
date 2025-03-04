import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
        {
            data: [20, 45, 80, 43],
            color: (opacity = 1) => `rgba(52, 75, 253, ${opacity})`,
            strokeWidth: 2
        }
    ]
};

export const TAssessmentContentMini = () => (
    <View>
        <LineChart
            data={chartData}
            width={screenWidth * 0.12}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={{ marginLeft: 10, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}
            withHorizontalLabels={false}
            withVerticalLabels={false}
            withInnerLines={false}
            withOuterLines={false}
            fromZero={true}
            yAxisSuffix=""
        />
    </View>
);

export const TotalAssessmentContent = () => (
    <View>
        <Text className="text-base text-gray-700">
            This shows the total number of assessments done this month.
        </Text>
        <View style={{ marginTop: 10 }}>
            <LineChart
                data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                    datasets: [{ data: [20, 45, 80, 43, 10], color: () => `rgba(52, 75, 253, 1)`, strokeWidth: 2 }]
                }}
                width={460}
                height={180}
                chartConfig={{
                    backgroundGradientFrom: "transparent",
                    backgroundGradientTo: "transparent",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                bezier
                // withInnerLines={false}
                style={{ marginVertical: 8, alignSelf: "center" }}
            />
        </View>
    </View>
);

export const HighestRatedProgramContent = () => (
    <View>
        <Text className="text-base text-gray-700">
            Program XYZ has received the highest rating among all programs.
        </Text>
        <View style={{ marginTop: 10, padding: 10, backgroundColor: "#f5f5f5", borderRadius: 10 }}>
            <Text className="text-base text-black">✅ Rated 5 stars by 1500+ students</Text>
            <Text className="text-base text-black">✅ 98% completion rate</Text>
        </View>
    </View>
);

export const TotalRegisteredProgramsContent = () => (
    <View>
        <Text className="text-base text-gray-700">
            A total of 1235 programs are registered under TVET by the year 2025.
        </Text>
        <View style={{ marginTop: 10, flexDirection: "row", gap: 10 }}>
            <Text className="text-sm text-gray-500">📅 Enrollment for new students: Open</Text>
            <Text className="text-sm text-gray-500">📍 Locations: 5 major cities</Text>
        </View>
    </View>
);

const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(74, 144, 242, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: "4",
        strokeWidth: "1",
        stroke: "#344BFD"
    },
    propsForBackgroundLines: {
        display: "none", // Hide grid lines
    },
    propsForLabels: {
        fontSize: 0, // Make labels invisible instead of using display:none
    },
}