import { useQuery } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite";
import { UserData } from "@/types/ReportTypes";

export const fetchUsers = async () => {
    const usersResponse = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
    );

    const userData = usersResponse.documents.map((doc) => ({
        id: doc.userId,
        name: doc.name || "N/A",
        institution: doc.institution || "",
        faculty: doc.fakulti || "", // Mapping 'fakulti' to 'faculty'
        programName: doc.programName || "N/A",
        position: doc.jawatan || "N/A", // Mapping 'jawatan' to 'position'
    })) as UserData[];

    // Map and transform as needed.
    return userData;
};

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
        staleTime: 1000 * 60 * 5,
    });
};