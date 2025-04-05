import { useQuery } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite";

const fetchPrograms = async () => {
    const programsResponse = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PROGRAMS_COLLECTION_ID
    );
    // Map the data to include starRating if it's named differently in the database
    return programsResponse.documents.map((program) => ({
        ...program,
        programId: program.programId || program.id, // Ensure the correct mapping
        programName: program.program_name || program.name,
        starRating: program.starRating || program.rating || 0,
    }));
};

export const usePrograms = () => {
    return useQuery({
        queryKey: ["programs"],
        queryFn: fetchPrograms,
        staleTime: 1000 * 60 * 5,
    });
};