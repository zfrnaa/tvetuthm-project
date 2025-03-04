import "../styles/global.css"
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { account } from "@/lib/appwrite"; // Adjust import to match your setup

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        // console.log("User is logged in:", user);
        router.replace("/dashboard"); // Redirect to dashboard if logged in
      } catch (error) {
        console.log("No active session, redirecting to login.");
        router.replace("/auth/login"); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null; // Prevent flickering during auth check

  return null;
}