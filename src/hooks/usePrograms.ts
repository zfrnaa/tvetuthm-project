// import { databases } from "@/lib/appwrite";
// import { useQuery } from "@tanstack/react-query";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { ProgramsData } from "@/types/ReportTypes";

export const usePrograms = () => {
    const [data, setData] = useState<ProgramsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "programs"), (snapshot) => {
            setData(snapshot.docs.map((doc) => {
                const d = doc.data();
                return {
                    id: doc.id,
                    programId: d.programId || doc.id,
                    programName: d.programName || "Unknown Program",
                    starRating: d.starRating || 0,
                    createdAt: d.createTime?.toDate() ?? new Date(),
                };
            }));
            setIsLoading(false);
        },
        (error) => {
            console.error("Error fetching programs:", error);
            setIsError(true);
            setError(error);
            setIsLoading(false);
        }
    );
        return () => unsub();
    }, []);

    return { data, isLoading, isError, error };
};