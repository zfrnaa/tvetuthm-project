import { useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const { openSignIn } = useClerk();
  const [error, setError] = useState<string | null>(null);
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { getToken } = useAuth();
  const auth = getAuth();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!clerkLoaded) {
        throw new Error("Clerk is not loaded yet.");
      }

      if (!clerkUser) {
        // Start Clerk OAuth flow with Google
        openSignIn({
          redirectUrl: "/dashboard",
        });
        return;
      }

      const sessionToken = await getToken();
      if (!sessionToken) {
        console.error("handleGoogleLogin: Failed to get Clerk session token.");
        setError("No session token available. Are you signed in?");
        setLoading(false);
        return;
      }
      const response = await axios.post(
        "/api/firebase-login",
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      const { firebaseToken } = response.data;
      console.log("handleGoogleLogin: Received Firebase custom token from backend.");

      // Sign in to Firebase with the custom token
      // await signInWithCustomToken(auth, firebaseToken);

      await signInWithCustomToken(auth, firebaseToken)
        .then((userCredential) => {
          // This is the critical confirmation
          console.log("handleGoogleLogin: Firebase signInWithCustomToken SUCCESS. User UID:", userCredential.user.uid);
          // Sync logic is now handled by UserContext's onAuthStateChanged listener.
          // Redirect can happen after successful Firebase sign-in confirmation.
          console.log("handleGoogleLogin: Redirecting to dashboard...");
          window.location.href = "/dashboard";
          // Note: setLoading(false) might not run if redirection is immediate.
        })
        .catch((error) => {
          console.error("handleGoogleLogin: Firebase signInWithCustomToken FAILED:", error);
          setError(`Firebase sign-in failed: ${error.message}`);
          // Stop the process if Firebase sign-in fails
          throw error; // Re-throw to be caught by the outer try/catch
        });

      // Sign in to Firebase with the token
      // await AuthService.syncUserToFirestore(
      //   {
      //     id: clerkUser.id,
      //     primaryEmailAddress: {
      //       emailAddress: clerkUser.primaryEmailAddress?.emailAddress || "unknown@example.com",
      //     },
      //     fullName: clerkUser.fullName || "Pengguna Tanpa Nama",
      //     imageUrl: clerkUser.imageUrl || "",
      //   },
      //   auth.currentUser?.uid || ""
      // );

      // console.log("Successfully authenticated with Firebase");
      // Redirect to the dashboard
      // window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same
  return (
      <div className="flex h-screen">
        {/* Left Section with Background */}
        <div className="w-1/2 flex justify-center items-center bg-blue-900 text-white p-10 relative">
          <img src="../src/assets/images/asmt-login-img.png" alt="UTHM Logo" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
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

          {/* Display Error Message */}
          {error && (
            <p className="text-red-500 text-center mt-4">
              {error}
            </p>
          )}
        </div>
      </div>
  );
};

export default LoginScreen;