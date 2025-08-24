import { useState, useEffect, useCallback } from 'react';
import { useUser as useClerkUser, useAuth } from '@clerk/clerk-react';
import { UserContext } from './userHooks';
import { onAuthStateChanged, signOut, signInWithCustomToken } from 'firebase/auth';
import { auth } from '../firebase';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { AuthService, ClerkUser } from '../auth';

export interface DatabaseUserData {
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
    firebaseData: DatabaseUserData | null;
    loading: boolean;
    error: Error | null;
    refreshFirebaseData: () => Promise<void>;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Normalized user object combining Clerk authentication with data
    const normalizedUser = clerkUser ? {
        id: clerkUser.id,
        name: clerkUser.fullName || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        avatarUrl: clerkUser.imageUrl
    } : null;

    const firebaseUidToFetch = clerkUser ? `clerk:${clerkUser.id}` : null;
    // Use React Query to fetch Firebase user data
    const { data: firebaseData, refetch, isLoading: isFetchingFirebaseData } = useFirebaseUser(firebaseUidToFetch);

    const refreshFirebaseData = async () => {
        // if (!clerkUser) return;
        if (!firebaseUidToFetch) {
            console.log("Refresh skipped: No user to refresh data for.");
            return;
        }

        setLoading(true);
        try {
            await refetch(); // Refetch Firebase data
            setError(null);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    // Define syncUserData function with useCallback
    const syncUserData = useCallback(async (currentFirebaseUid: string) => {
        // Ensure Clerk user data is available
        if (!clerkLoaded || !clerkUser) {
            console.log("Sync skipped: Clerk data not loaded yet.");
            return;
        }
        // Ensure we have the Firebase UID to write to
        if (!currentFirebaseUid) {
            console.log("Sync skipped: Firebase UID not available for sync target.");
            return;
        }

        setLoading(true); // Indicate loading during sync
        setError(null);
        // console.log(`Syncing Clerk user ${clerkUser.id} data to Firebase UID: ${currentFirebaseUid}`);

        try {
            // Prepare Clerk user data in the format expected by AuthService
            const clerkDataForSync: ClerkUser = {
                id: clerkUser.id,
                primaryEmailAddress: {
                    emailAddress: clerkUser.primaryEmailAddress?.emailAddress || "unknown@example.com",
                },
                fullName: clerkUser.fullName || "Pengguna Tanpa Nama",
                firstName: clerkUser.firstName!,
                lastName: clerkUser.lastName!,
                imageUrl: clerkUser.imageUrl,
                // googleAccessToken is not needed for sync
            };

            // Call the sync function from AuthService
            const success = await AuthService.syncUserToFirestore(clerkDataForSync, currentFirebaseUid);

            if (success) {
                // console.log("User data synced successfully via AuthService.");
                // Refetch Firebase data after successful sync to update local state
                await refetch();
                setError(null);
            } else {
                // AuthService.syncUserToFirestore returned false or threw an error handled internally
                throw new Error("AuthService.syncUserToFirestore indicated failure.");
            }

        } catch (err) {
            console.error("Failed to sync user data:", err);
            setError(err instanceof Error ? err : new Error("Unknown error during sync"));
        } finally {
            setLoading(false); // Sync attempt finished
        }
    }, [clerkLoaded, clerkUser, refetch]);

    // Sync user data between Clerk and Firebase
    useEffect(() => {
        if (!clerkLoaded) {
            setLoading(true); // Keep loading true while waiting for Clerk
            return;
        }
        if (!clerkUser) {
            console.log("UserContext Effect: No Clerk user. Ensuring Firebase is signed out.");
            if (auth.currentUser) { // Check if someone is signed into Firebase
                signOut(auth).catch(err => console.error("Firebase sign out error:", err));
            }
            setLoading(false); // No user, finished loading state
            setError(null);
            return;
        }

        setLoading(true);
        const expectedUid = `clerk:${clerkUser.id}`;

        const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
            // console.log(`onAuthStateChanged: FB User: ${currentFirebaseUser?.uid}, Expected: ${expectedUid}`);

            if (currentFirebaseUser) {
                // Firebase user is signed in
                if (currentFirebaseUser.uid === expectedUid) {
                    // Correct user is signed in. Sync data.
                    // console.log("Correct Firebase user found. Syncing data...");
                    await syncUserData(currentFirebaseUser.uid);
                    setLoading(false); // Sync attempted/done, finish loading
                    setError(null);
                } else {
                    // Wrong Firebase user signed in. Sign them out and try again.
                    console.warn(`Mismatch UID. Signing out FB user and attempting sign-in with correct token.`);
                    await signOut(auth);
                    // Let the next onAuthStateChanged(null) trigger the sign-in flow below.
                    // Keep loading true.
                }
            } else {
                // No Firebase user signed in. Need to sign in using custom token.
                console.log("No Firebase user found. Attempting custom token sign-in...");
                setError(null); // Clear previous errors
                try {
                    // *** Get the Clerk token ***
                    const sessionToken = await getToken(); // Call getToken
                    if (!sessionToken) {
                        // This might happen briefly during token refresh, handle appropriately
                        console.warn("Clerk session token not available yet. Retrying might be needed.");
                        // Optionally, you could add a small delay and retry or rely on Clerk's state changes
                        // For now, throw an error or return to prevent proceeding without a token
                        throw new Error("Clerk session token not available.");
                    }
                    // Fetch custom token from your backend API
                    // Clerk's useAuth hook automatically manages token propagation for fetch
                    // if the API route is on the same domain or configured correctly.
                    const response = await fetch('/api/firebase-login', {
                        method: 'POST',
                        headers: {
                            // Add Authorization header
                            'Authorization': `Bearer ${sessionToken}`,
                            'Content-Type': 'application/json' // Good practice
                        },
                    });

                    if (!response.ok) {
                        let errorMsg = `Firebase login API failed: ${response.statusText}`;
                        try {
                            const errorData = await response.json();
                            errorMsg = errorData.error || errorMsg;
                        } catch (e) { console.error("Failed to parse error response:", e); }
                        throw new Error(errorMsg);
                    }

                    const { firebaseToken } = await response.json();

                    if (!firebaseToken) {
                        throw new Error("No Firebase token received from backend.");
                    }

                    // Sign in to Firebase with the custom token
                    console.log("Received custom token. Signing into Firebase...");
                    await signInWithCustomToken(auth, firebaseToken);
                    // Sign-in successful. onAuthStateChanged will fire again with the new user.
                    // The next cycle will handle the sync. Keep loading true.
                    console.log("signInWithCustomToken successful. Waiting for onAuthStateChanged.");

                } catch (err) {
                    console.error("Failed to fetch token or sign in with custom token:", err);
                    setError(err instanceof Error ? err : new Error("Firebase sign-in failed"));
                    setLoading(false); // Sign-in process failed, stop loading
                }
            }
        });

        // Cleanup function
        return () => {
            unsubscribe();
        };
        // Add auth instance to dependencies
    }, [clerkLoaded, clerkUser, syncUserData, isFetchingFirebaseData, getToken]);


    return (
        <UserContext.Provider value={{
            user: normalizedUser,
            firebaseData: firebaseData || null,
            loading: loading || !clerkLoaded,
            error,
            refreshFirebaseData
        }}>
            {children}
        </UserContext.Provider>
    );
};