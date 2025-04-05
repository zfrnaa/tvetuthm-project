import { useQuery } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite";
import { ReportDocument } from "@/types/ReportTypes";

const fetchResults = async () => {
    const reportResponse = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_RESULTS_COLLECTION_ID
    );

    // Merge each report with the corresponding user faculty (using userId)
    const reportData = reportResponse.documents as unknown as ReportDocument[];

    return reportData;
};

export const useResults = () => {
    return useQuery({
        queryKey: ["results"],
        queryFn: fetchResults,
        staleTime: 1000 * 60 * 5,
    });
};