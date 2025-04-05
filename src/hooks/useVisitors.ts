import { useQuery } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite";
import { VisitorData } from "@/types/ReportTypes";

export const fetchVisitors = async () => {
    const visitorsResponse = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_VISITORS_COLLECTION_ID // create this env variable if it doesn't exist
    );

    const visitorData = visitorsResponse.documents.map((doc) => ({
        // Adjust mapping based on your document structure
        visited_at: doc.visitor_at,
        status: doc.status || "N/A",
        // other properties as needed
    })) as VisitorData[];

    return visitorData;
};

export const useVisitors = () => {
    return useQuery({
        queryKey: ["visitors"],
        queryFn: fetchVisitors,
        staleTime: 1000 * 60 * 5,
    });
};