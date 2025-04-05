import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "./lib/appwrite";
import { useCustomFonts } from "./lib/fonts/font";

export default function Index() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const fontsLoaded = useCustomFonts();

    useEffect(() => {
        if (!fontsLoaded) return; // ✅ Prevents infinite loop

        const checkAuth = async () => {
            try {
                await account.get();
                navigate("/homedashboard"); // ✅ Redirect if logged in
            } catch {
                navigate("/auth/login"); // ✅ Redirect if not logged in
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [fontsLoaded, navigate]);

    if (!fontsLoaded || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
                <div className="loader" /> {/* ✅ Prevent flickering */}
            </div>
        );
    }

    return null;
}
