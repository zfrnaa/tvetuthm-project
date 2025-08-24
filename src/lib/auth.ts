// import { databases } from "./appwrite";
// import { UserResource } from "@clerk/types";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { DatabaseUserData } from "src/lib/contexts/UserContext.tsx";

export interface ClerkUser {
  id: string;
  primaryEmailAddress: { emailAddress: string };
  fullName: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  googleAccessToken?: string;
}

export class AuthService {

  static async signInWithClerk(clerkUser: ClerkUser): Promise<boolean> {
    try {
      if (!clerkUser.googleAccessToken) {
        console.error("No Google access token available from Clerk");
        return false;
      }

      // Create credentials with the token
      const credential = GoogleAuthProvider.credential(null, clerkUser.googleAccessToken);

      // Sign in to Firebase with the credential
      const auth = getAuth();
      const result = await signInWithCredential(auth, credential);

      // Sync user data to Firestore
      if (result.user) {
        await this.syncUserToFirestore(clerkUser, result.user.uid);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to sign in with Clerk credentials:", error);
      return false;
    }
  }

  static async syncUserToFirestore(clerkUser: ClerkUser, firebaseUid: string): Promise<boolean> {
    try {
      const userRef = doc(db, "users", firebaseUid);
      const userDoc = await getDoc(userRef);

      const userData = {
        email: clerkUser.primaryEmailAddress?.emailAddress,
        name: clerkUser.fullName || `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        avatar_url: clerkUser.imageUrl,
        clerk_id: clerkUser.id, // Store Clerk ID for reference
      };

      if (userDoc.exists()) {
        const existingData = userDoc.data();
        const isChanged = Object.keys(userData).some(
          key => userData[key as keyof typeof userData] !== existingData[key]
        );

        if (isChanged) {
          await updateDoc(userRef, userData);
        } else {
          // If only last_sign_in needs updating
          await updateDoc(userRef, { last_sign_in: serverTimestamp() });
        }
      } else {
        // Create new user
        await setDoc(userRef, {
          ...userData,
          created_at: serverTimestamp(),
        });
      }

      // console.log("User synced to Firebase successfully");
      return true;
    } catch (error) {
      console.error("Error syncing user to Firebase:", error);
      return false;
    }
  }

  static getUserDataFromFirebase = async (userId: string): Promise<DatabaseUserData | null> => {
    const userDocRef = doc(db, "users", userId);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();

    return {
      $id: userId,
      name: data.name,
      email: data.email,
      avatar_url: data.avatar_url,
      ...data,
    };
  };

}