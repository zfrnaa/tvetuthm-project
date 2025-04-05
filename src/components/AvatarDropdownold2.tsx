import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../lib/appwrite";
import { useUser } from "../lib/contexts/UserContext.tsx.bak";

const AvatarDropdown = ({ avatar = null }) => {
    const [visible, setVisible] = useState(false);
    const { user, loading } = useUser(); // ✅ Get user from context
    const navigate = useNavigate(); // ✅ Use `useNavigate()` instead of `useRouter()`

    const toggleMenu = () => setVisible(!visible);

    const handleLogout = async () => {
        setVisible(false);
        try {
            await account.deleteSession("current"); // ✅ Log out from Appwrite
            navigate("/auth/login"); // ✅ Redirect to login page
        } catch (error) {
            console.error("Appwrite logout error:", error);
        }
    };

    // ✅ Generate initials from the user's name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2); // Limit to 2 characters
    };

    const userName = loading ? "Loading..." : user?.name || "Unknown User";

    return (
        <div className="flex-1">
            {/* Profile Icon / Initials */}
            <button onClick={toggleMenu} className="w-10 h-10 bg-blue-600 dark:bg-darkSecondary rounded-full flex items-center justify-center">
                {avatar ? (
                    <span className="text-lg text-white">{avatar}</span>
                ) : (
                    <span className="text-lg text-white font-bold">{getInitials(userName)}</span>
                )}
            </button>

            {/* Dropdown Menu */}
            {visible && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <button
                        className="block w-full px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default AvatarDropdown;
