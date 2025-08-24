// import { useQuery } from "@tanstack/react-query";
// import { databases } from "@/lib/appwrite";
import { VisitorData } from "@/types/ReportTypes";
import { collection, onSnapshot, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

// Function to map Firestore document data to VisitorData
const mapVisitorData = (doc: QueryDocumentSnapshot<DocumentData>): VisitorData => {
    const data = doc.data();
    return {
        visited_at: data.visited_at || "Unknown Date", // Map Firestore field to `visited_at`
        status: data.status || "N/A", // Default to "N/A" if status is missing
    };
};

// export const fetchVisitors = async () => {
//     // const visitorsResponse = await databases.listDocuments(
//     //     import.meta.env.VITE_APPWRITE_DATABASE_ID,
//     //     import.meta.env.VITE_APPWRITE_VISITORS_COLLECTION_ID // create this env variable if it doesn't exist
//     // );

//     // const visitorData = visitorsResponse.documents.map((doc) => ({
//     //     // Adjust mapping based on your document structure
//     //     visited_at: doc.visitor_at,
//     //     status: doc.status || "N/A",
//     //     // other properties as needed
//     // })) as VisitorData[];

//     // return visitorData;

//     // Fetch the "visitors" collection from Firestore
//     const visitorsCollection = collection(db, "visitors");
//     const visitorsSnapshot = await getDocs(visitorsCollection);

//     // Use the mapping function to transform Firestore documents
//     return visitorsSnapshot.docs.map(mapVisitorData);

// };

// export const useVisitors = () => {
//     return useQuery({
//         queryKey: ["visitors"],
//         queryFn: fetchVisitors,
//         staleTime: 1000 * 60 * 5,
//     });
// };

export const useVisitors = () => {
    const [data, setData] = useState<VisitorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "visitors"), (snapshot) => {
            setData(snapshot.docs.map(mapVisitorData));
            setIsError(false);
            setIsLoading(false);
        },
        (err) => {
            setIsError(true);
            setError(err);
        }
    );
        return () => unsub();
    }, []);

    return { data, isLoading, isError, error };
};