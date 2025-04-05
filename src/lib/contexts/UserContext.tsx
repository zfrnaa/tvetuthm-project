import { useState, useEffect, useCallback } from 'react';
import { useUser as useClerkUser } from '@clerk/clerk-react';
import { AuthService } from '../auth';
import { UserContext } from './userHooks';

export interface AppwriteUserData {
    $id: string;
    name: string;
    email: string;
    avatar_url?: string;
    [key: string]: string | number | boolean | undefined | null | string[] | unknown[]; // For any additional custom fields
}

export interface UserContextType {
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    } | null;
    appwriteData: AppwriteUserData | null;
    loading: boolean;
    error: Error | null;
    refreshAppwriteData: () => Promise<void>;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
    const [appwriteData, setAppwriteData] = useState<AppwriteUserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Normalized user object combining Clerk authentication with Appwrite data
    const normalizedUser = clerkUser ? {
        id: clerkUser.id,
        name: clerkUser.fullName || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        avatarUrl: clerkUser.imageUrl
    } : null;

    // Define syncUserData function with useCallback
    const syncUserData = useCallback(async () => {
        if (!clerkLoaded) return;

        if (clerkUser) {
            setLoading(true);
            try {
                // Sync user to Appwrite
                await AuthService.syncUserToAppwrite(clerkUser);

                // Fetch user data from Appwrite
                const appwriteUserData = await AuthService.getUserDataFromAppwrite(clerkUser.id);
                if (appwriteUserData && typeof appwriteUserData === 'object' && '$id' in appwriteUserData) {
                    setAppwriteData({
                        ...appwriteUserData,
                        name: appwriteUserData.name || clerkUser.fullName || "User",
                        email: appwriteUserData.email || clerkUser.primaryEmailAddress?.emailAddress || "",
                        avatar_url: appwriteUserData.avatar_url
                    });
                } else {
                    setAppwriteData(null);
                }
                setError(null);
            } catch (err) {
                console.error("Failed to sync user data:", err);
                setError(err instanceof Error ? err : new Error("Unknown error"));
            } finally {
                // console.log("Clerk Image URL:", clerkUser.imageUrl);

                setLoading(false);
            }
        }
    }, [clerkLoaded, clerkUser]);

    // Sync user data between Clerk and Appwrite
    useEffect(() => {
        if (clerkLoaded) {
            syncUserData();
        }
    }, [clerkLoaded, syncUserData]);

    const refreshAppwriteData = async () => {
        if (!clerkUser) return;

        setLoading(true);
        try {
            const appwriteUserData = await AuthService.getUserDataFromAppwrite(clerkUser.id);
            if (appwriteUserData && typeof appwriteUserData === 'object' && '$id' in appwriteUserData) {
                setAppwriteData({
                    ...appwriteUserData,
                    name: appwriteUserData.name || clerkUser.fullName || "User",
                    email: appwriteUserData.email || clerkUser.primaryEmailAddress?.emailAddress || "",
                    avatar_url: appwriteUserData.avatar_url
                });
                setAppwriteData(null);
            }
            setError(null);
        }
        catch (err) {
            console.error("Failed to fetch user data:", err);
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clerkLoaded) {
            syncUserData();
        }
    }, [clerkLoaded, clerkUser, syncUserData]);

    return (
        <UserContext.Provider value={{
            user: normalizedUser,
            appwriteData,
            loading: loading || !clerkLoaded,
            error,
            refreshAppwriteData
        }}>
            {children}
        </UserContext.Provider>
    );
};