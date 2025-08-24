import { useEffect, useState } from "react";
import { ReportDocument } from "@/types/ReportTypes";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useResults = () => {
    const [data, setData] = useState<ReportDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const q = query(
        collection(db, "results"),
        orderBy("completed_at", "desc"),
        limit(50) // Adjust to your needs
    );

    useEffect(() => {
        const unsub = onSnapshot(q, (snapshot) => {
            setData(snapshot.docs.map((doc) => {
                const d = doc.data();
                return {
                    id: doc.id,
                    totalScore: d.totalScore,
                    completed_at: d.completed_at || "",
                    faculty: d.faculty || "Unknown",
                    institution: d.institution || "Unknown",
                    userId: d.userId || null,
                    clusterScores: d.clusterScores || [],
                    cippScores: d.cippScores || [],
                    programName: d.programName || "Unknown",
                    programId: d.programId || null,
                } as ReportDocument;
            }));
            setIsLoading(false);
        },
            (error) => {
                setIsError(true);
                setError(error);
            }
        );
        return () => unsub();
    }, []);

    return { data, isLoading, isError, error };
};