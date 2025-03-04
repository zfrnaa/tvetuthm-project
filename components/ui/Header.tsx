import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { UserCircle2 } from "lucide-react-native";
import CountryFlag from "react-native-country-flag";
import { Link, usePathname } from "expo-router";
import PaperDropdown from "../AvatarDropdown";
import { useTranslation } from "react-i18next";
import { useFonts } from "expo-font";

const screenWidth = Dimensions.get("window").width;

const Header: React.FC = () => {
    const [fontsLoaded, fontError] = useFonts({
        "GeistSans-Regular": require("../../assets/fonts/GeistSans/Geist-Regular.ttf"),
        "GeistSans-Medium": require("../../assets/fonts/GeistSans/Geist-Medium.ttf"),
        "GeistSans-Bold": require("../../assets/fonts/GeistSans/Geist-Bold.ttf"),
        "GeistMono-Regular": require("../../assets/fonts/GeistMono/GeistMono-Regular.ttf"),
        "GeistMono-Medium": require("../../assets/fonts/GeistMono/GeistMono-Medium.ttf"),
        "GeistMono-Bold": require("../../assets/fonts/GeistMono/GeistMono-Bold.ttf"),
    });

    const logo = require("../../assets/images/uthm_logo.png");
    const { t, i18n } = useTranslation();
    const pathname = usePathname(); // Get current route

    const tabs = [
        { label: t("Dashboard"), route: "/dashboard" },
        { label: t("About Us"), route: "/mengenai-sistem" },
        { label: t("Report"), route: "/laporan" },
        { label: t("Information"), route: "/maklumat" },
    ];

    return (
        <View className="flex-column justify-between px-4 transparent backdrop-blur-md">
            <View className="flex-row items-center justify-between p-4 transparent backdrop-blur-md">
                {/* Logo */}
                <Image source={logo} style={{ width: 200, height: 80 }} />

                {/* Header Tabs */}
                <View className="flex-row space-x-4">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.route;
                        return (
                            <Link key={tab.label} href={tab.route as any} asChild>
                                <TouchableOpacity>
                                    <View className={`px-4 py-2 rounded-full ${isActive ? "bg-gray-900 dark" : "dark"} hover:bg-gray-700 dark:hover:bg-gray-400`}>
                                        <Text className={`text-md font-geistSansMedium ${isActive ? "text-black-900 dark:text-white" : "text-gray-800 dark:text-black-300"}`}>
                                            {tab.label}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        );
                    })}
                </View>

                {/* Language Selector & Avatar */}
                <View className="flex-row items-center space-x-4 font-geistMono">
                    <SelectDropdown
                        data={[
                            { key: "en", label: t("English") },
                            { key: "ms", label: t("Malay") },
                        ]}
                        defaultValue={{ key: "ms", label: t("Malay") }}
                        onSelect={(selectedItem) => i18n.changeLanguage(selectedItem.key)}
                        renderButton={(selectedItem) => (
                            <View className="flex-row items-center space-x-2 p-2 border border-gray-300 rounded-md">
                                <Text className="text-gray-700 font-medium">{selectedItem?.label || t("Select language")}</Text>
                                <CountryFlag isoCode={selectedItem?.key === "ms" ? "MY" : "GB"} size={20} />
                            </View>
                        )}
                        renderItem={(item) => (
                            <View className="flex-row items-center space-x-2 p-2">
                                <Text className="text-gray-700 font-medium">{item.label}</Text>
                                <CountryFlag isoCode={item.key === "ms" ? "MY" : "GB"} size={20} />
                            </View>
                        )}
                    />
                    <PaperDropdown />
                </View>
            </View>

            <View className="border-b border-gray-400 self-center" style={{width: screenWidth-80}} />
        </View>
    );
};

export default Header;


{/* <TouchableOpacity>
{
    avatar ? (
        <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
            <Text className="text-lg text-white">{avatar}</Text>
        </View>
    ) : (
        <UserCircle2 size={32} color="gray" />
    )
}
</TouchableOpacity > */}