import React from "react";
import { View, ScrollView } from "react-native";
import Header from "../../components/ui/Header";
import { LinearGradient } from "expo-linear-gradient";
import RuangMaklumat from "@/components/RuangMaklumat";

const Maklumat: React.FC = () => {

    return (
        <View className="flex-1 bg-white">
            <LinearGradient colors={["#F3F3F3", "#D7E1F3"]} className="absolute inset-0" />
            <Header />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <RuangMaklumat />
            </ScrollView>
        </View>
    );
};

export default Maklumat;
