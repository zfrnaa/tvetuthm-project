import { databases } from "./appwrite";
import { UserResource } from "@clerk/types";

/**
 * Service to handle authentication flow between Clerk and Appwrite
 */
export class AuthService {
  /**
   * Sync a Clerk user to Appwrite database
   * Creates or updates the user document in Appwrite
   */
  static async syncUserToAppwrite(clerkUser: UserResource): Promise<boolean> {
    if (!clerkUser) return false;

    // Use VITE_ prefix for environment variables
    const dbId = import.meta.env.VITE_APPWRITE_DB_ID_SYNC;
    const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID_SYNC;

    if (!dbId || !collectionId) {
      console.error("Environment variables are not properly set");
      return false;
    }

    try {
      // Check if user already exists in Appwrite
      try {
        // Try to get the user document from Appwrite first
        await databases.getDocument(
          dbId,
          collectionId,
          clerkUser.id
        );

        // If found, update the document
        await databases.updateDocument(
          dbId,
          collectionId,
          clerkUser.id,
          {
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName,
            avatar_url: clerkUser.imageUrl,
            last_sign_in: new Date().toISOString()
          }
        );
      } catch (error) {
        // If not found (404), create new document
        console.log("User not found in Appwrite, creating new document:", error);
        await databases.createDocument(
          dbId,
          collectionId,
          clerkUser.id, // Use Clerk's user ID as document ID
          {
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName,
            avatar_url: clerkUser.imageUrl,
            created_at: new Date().toISOString(),
            last_sign_in: new Date().toISOString()
          }
        );
      }

      console.log("User synced to Appwrite successfully");
      return true;
    } catch (error) {
      console.error("Error syncing user to Appwrite:", error);
      return false;
    }
  }


  /**
   * Gets user data from Appwrite database
   * Useful for getting custom user data stored in Appwrite
   */
  static async getUserDataFromAppwrite(userId: string) {
    const dbId = import.meta.env.VITE_APPWRITE_DB_ID_SYNC;
    const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID_SYNC;

    if (!dbId || !collectionId) {
      console.error("Environment variables are not properly set");
      return null;
    }

    try {
      const userData = await databases.getDocument(
        dbId,
        collectionId,
        userId
      );
      return userData;
    } catch (error) {
      console.error("Error fetching user data from Appwrite:", error);
      return null;
    }
  }
}