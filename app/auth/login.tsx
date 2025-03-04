import { makeRedirectUri, useAuthRequest, ResponseType } from "expo-auth-session";
import { Eye, EyeClosed, LockKeyholeIcon, UserCircle2 } from "lucide-react-native";
import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ImageBackground,
    Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import GlassBackground from "@/components/AlphawBackground";

// Appwrite imports:
import { account, client } from "@/lib/appwrite";
import { Databases, ID } from "react-native-appwrite";
import { I18nextProvider } from "react-i18next";
import i18n from "@/locales/i18n";

const LoginScreen = () => {

    const databases = new Databases(client);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Configure the authentication request
    const redirectUri = makeRedirectUri({
        scheme: "myapp", // Ensure this matches your app's scheme
        native: "myapp://redirect",
    });

    const authUrl = `${client.config.endpoint}/account/sessions/oauth2/google` +
        `?project=${client.config.project}` +
        `&success=${encodeURIComponent(redirectUri)}` +
        `&failure=${encodeURIComponent(redirectUri)}`;

    const [request, , promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: client.config.project,
            redirectUri,
            scopes: [],
        },
        { authorizationEndpoint: authUrl }
    );

    const router = useRouter();

    const handleGoogleLogin = useCallback(async () => {
        try {
            if (request) {
                const result = await promptAsync();

                if (result.type === "success") {
                    console.log("Google Auth Response:", result.params);

                    // 🔹 Fetch user details
                    const user = await account.get();

                    // 🔹 Restrict login to allowed emails
                    if (!allowedEmails.includes(user.email.toLowerCase())) {
                        Alert.alert("Login Failed", "Your email is not allowed to access this system.");
                        await account.deleteSession("current"); // 🚨 Logout immediately
                        return;
                    }

                    // 🔹 Save user details in Appwrite
                    await saveUserDetailsToAppwrite(user);

                    // 🔹 Redirect to dashboard
                    router.replace("/dashboard");
                } else {
                    Alert.alert("Login Error", "Authentication canceled or failed.");
                    console.error("Auth Error:", result);
                }
            } else {
                Alert.alert("Error", "Authentication request not ready.");
            }
        } catch (error: any) {
            Alert.alert("Login Error", error.message);
            console.error("Login Error:", error);
        }
    }, [request]);

    const allowedEmails = ["admin@example.com", "staff@tvet.edu.my"]; // ✅ Allowed users

    // const handleManualLogin = async () => {
    //     try {
    //         const session = await account.createSession(userName, password);
    //         console.log("Session Created:", session);

    //         // 🔹 Fetch user details after login
    //         const user = await account.get();
    //         console.log("Logged-in User:", user);

    //         // 🔹 Restrict login to allowed emails
    //         if (!allowedEmails.includes(user.email)) {
    //             Alert.alert("Login Failed", "Your email is not allowed to access this system.");
    //             await account.deleteSession("current"); // 🚨 Logout immediately
    //             return;
    //         }

    //         // 🔹 Save user details in Appwrite
    //         await saveUserDetailsToAppwrite(user);

    //         // 🔹 Redirect to dashboard
    //         router.replace("/dashboard");
    //     } catch (error: any) {
    //         Alert.alert("Login Failed", error.message);
    //         console.error("Login Error:", error);
    //     }
    // };

    const saveUserDetailsToAppwrite = async (user: any) => {
        if (!user || !user.$id || !user.email) {
            console.error("Invalid user data received:", user);
            return;
        }

        // ✅ Ensure `user.$id` is valid, otherwise generate a unique ID
        const documentId = /^[a-zA-Z0-9_.-]{1,36}$/.test(user.$id) ? user.$id : ID.unique();

        try {
            // 🔹 Try updating existing user
            await databases.updateDocument("67c2d5470019e677822f", "67c42fd600025ea82020", documentId, {
                name: user.name || "Unknown", // ✅ Default value if name is missing
                email: user.email,
                userId: user.$id,
            });
            console.log("User updated in Appwrite:", user);
        } catch (error) {
            console.warn("User not found, creating new record...");

            // 🔹 If user doesn't exist, create a new entry
            try {
                await databases.createDocument("67c2d5470019e677822f", "67c42fd600025ea82020", ID.unique(), {
                    name: user.name || "Unknown", // ✅ Default value
                    email: user.email,
                    userId: user.$id,
                });
                console.log("New user saved to Appwrite:", user);
            } catch (err) {
                console.error("Failed to save user in Appwrite:", err);
            }
        }
    };


    return (
        <I18nextProvider i18n={i18n}>
            <GlassBackground>
                <View className="flex-row w-full h-full">

                    {/* Left Image Section (50% width) */}
                    <View className="w-1/2 h-full overflow-hidden">
                        <ImageBackground
                            source={require("../../assets/images/asmt-login-img.png")}
                            className="w-full h-full justify-center items-center"
                            resizeMode="cover"
                        >
                            <Text className="text-white text-2xl italic font-bold text-center px-4 mb-3">
                                "Transforming data into actionable insights for TVET assessment excellence"
                            </Text>
                            <Text className="text-white mt-2">— UTHM</Text>
                        </ImageBackground>
                    </View>

                    {/* Right Login Form Section (50% width) */}
                    <View className="w-1/2 h-full p-8 flex justify-center bg-white">
                        <View className="justify-center items-center mb-8">
                            <Image
                                source={require("../../assets/images/uthm_logo.png")}
                                style={{ width: 360, height: 140 }}
                                resizeMode="contain"
                            />
                        </View>

                        <Text className="text-3xl font-bold mb-4 text-gray-800 text-justify">
                            Selamat kembali ke{" "}
                            <Text className="text-blue-600">
                                Data Pengurusan Program TVET
                            </Text>
                        </Text>

                        <Text className="text-2xl font-semibold text-gray-800 mb-8">
                            Log Masuk
                        </Text>

                        {/* Username Input */}
                        {/* <View className="mb-4 relative">
                            <TextInput
                                className="w-full bg-white border border-gray-300 rounded-lg p-4 pl-12 text-gray-700"
                                onChangeText={setUserName}
                                value={userName}
                                placeholder="Emel staff"
                                autoComplete="username"
                                placeholderTextColor="#9CA3AF"
                            />
                            <View className="absolute top-4 left-4">
                                <UserCircle2 size={20} color="#6B7280" />
                            </View>
                        </View> */}

                        {/* Password Input */}
                        {/* <View className="mb-6 relative">
                            <TextInput
                                className="w-full bg-white border border-gray-300 rounded-lg p-4 pl-12 pr-12 text-gray-700"
                                onChangeText={setPassword}
                                value={password}
                                placeholder="Kata Laluan"
                                secureTextEntry={!passwordVisible}
                                autoComplete="password"
                                placeholderTextColor="#9CA3AF"
                            />
                            <View className="absolute top-4 left-4">
                                <LockKeyholeIcon size={20} color="#6B7280" />
                            </View>
                            <TouchableOpacity
                                onPress={togglePasswordVisibility}
                                className="absolute top-4 right-4"
                            >
                                {passwordVisible ? (
                                    <Eye size={20} color="#6B7280" />
                                ) : (
                                    <EyeClosed size={20} color="#6B7280" className="opacity-50" />
                                )}
                            </TouchableOpacity>
                        </View> */}

                        {/* Google Login Button */}
                        <TouchableOpacity
                            className="bg-blue-800 rounded-lg p-4 flex-row justify-center items-center mt-4"
                            onPress={handleGoogleLogin}
                        >
                            <Text className="text-white text-center font-semibold">
                                <FontAwesome name="google" size={20} color="#FF5577" className="mr-2" />
                                Log Masuk dengan Google
                            </Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            className="bg-blue-800 rounded-lg p-4 flex-row justify-center items-center mt-4"
                            onPress={handleManualLogin}
                        >
                            <Text className="text-white text-center font-semibold">
                                <FontAwesome name="google" size={20} color="#FF5577" className="mr-2" />
                                Log Masuk
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </GlassBackground>
        </I18nextProvider>
    );
};

export default LoginScreen;