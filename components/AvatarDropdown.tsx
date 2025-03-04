import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Menu, TouchableRipple } from "react-native-paper";
import { account } from "@/lib/appwrite";
import { useRouter } from "expo-router";

const PaperDropdown = ({ avatar = null }) => {
    const [visible, setVisible] = useState(false);
    const [userName, setUserName] = useState("Loading..."); // ✅ Default value
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await account.get(); // ✅ Fetch user data from Appwrite
                if (user.name) {
                    setUserName(user.name); // ✅ Set name if available
                } else {
                    setUserName("Unknown User"); // ✅ Default if no name exists
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setUserName("Unknown User"); // ✅ Fallback in case of error
            }
        };

        fetchUserData();
    }, []);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleLogout = async () => {
        closeMenu();
        try {
            await account.deleteSession("current"); // ✅ Sign out from Appwrite
            router.push("/auth/login"); // ✅ Redirect to login
        } catch (error) {
            console.error("Appwrite logout error:", error);
        }
    };

    // ✅ Generate initials from the fetched user name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2); // Limit to 2 characters
    };

    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableRipple onPress={openMenu} borderless>
                        {avatar ? (
                            <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
                                <Text className="text-lg text-white">{avatar}</Text>
                            </View>
                        ) : (
                            <View className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center">
                                <Text className="text-lg text-white font-bold">
                                    {getInitials(userName)}
                                </Text>
                            </View>
                        )}
                    </TouchableRipple>
                }
            >
                <Menu.Item onPress={handleLogout} title="Logout" style={{ position: "relative" }} />
            </Menu>
        </View>
    );
};

export default PaperDropdown;
