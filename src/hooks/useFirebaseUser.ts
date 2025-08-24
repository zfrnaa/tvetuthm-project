import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../lib/auth";
import { DatabaseUserData } from "@/lib/contexts/UserContext";

// Fetch function for Firebase user
export const fetchFirebaseUser = async (userId: string): Promise<DatabaseUserData | null> => {
  if (!userId) return null;

  try {
    const firebaseUserData = await AuthService.getUserDataFromFirebase(userId);

    if (firebaseUserData) {

        return firebaseUserData;
    } else {
        console.log(`fetchFirebaseUser: No data found for ${userId}.`);
        return null;
    }
  } catch (error) {
      console.error(`fetchFirebaseUser: Error fetching data for ${userId}:`, error);
      return null; // Option 2: Treat error as "no data"
  }
};

// Hook for Firebase user
export const useFirebaseUser = (userId: string | null | undefined) => {
  return useQuery<DatabaseUserData | null>({
    queryKey: ["firebaseUser", userId],
    queryFn: () => fetchFirebaseUser(userId!), // Use the fetch function
    enabled: !!userId, // Only fetch if userId is not null or undefined
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });
};