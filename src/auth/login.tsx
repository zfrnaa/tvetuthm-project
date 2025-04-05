import { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../locales/i18n";
const { FcGoogle } = await import("react-icons/fc");

const LoginScreen = () => {
    const [loading, setLoading] = useState(false);
    const { redirectToSignIn } = useClerk();

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await redirectToSignIn({
                redirectUrl: "/dashboard",
                // You can specify Google as the first authentication method to show
            });
        } catch (error) {
            console.error("Google Login failed:", error);
            setLoading(false);
        }
    };

    return (
        <I18nextProvider i18n={i18n}>
            <div className="flex h-screen">
                {/* Left Section with Background */}
                <div className="w-1/2 flex justify-center items-center bg-blue-900 text-white p-10 relative">
                    <img src="../src/assets/images/asmt-login-img.png" loading="lazy" alt="UTHM Logo" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
                    <div className="relative z-10 justify-center text-center">
                        <h2 className="text-2xl font-bold italic m-auto text-center mb-3">
                            "Transforming data into actionable insights for TVET assessment excellence"
                        </h2>
                        <p>— UTHM</p>
                    </div>
                </div>

                {/* Right Section - Login Form */}
                <div className="w-1/2 flex flex-col justify-center p-10 bg-gray-100">
                    <img src="../src/assets/images/uthm_logo.png" loading="lazy" alt="UTHM Logo" className="w-100 mx-auto mb-6" />
                    <div className="justify-center items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Selamat Datang ke</h1>
                        <h2 className="text-2xl font-semibold text-blue-600">Data Pengurusan Program TVET</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">Log Masuk</h3>
                    </div>

                    {/* Google Login Button */}
                    <button
                        className="text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 mt-6"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{ backgroundColor: "#00458f" }}
                    >
                        <FcGoogle size={20} /> {loading ? "Logging in..." : "Log Masuk dengan Google"}
                    </button>
                </div>
            </div>
        </I18nextProvider>
    );
};

export default LoginScreen;