// import { useQuery } from "@tanstack/react-query";
// import { databases } from "@/lib/appwrite";
// import { UserData } from "@/types/ReportTypes";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "@/types/ReportTypes";
import { useEffect, useState } from "react";

// export const fetchUsers = async () => {
//     // const usersResponse = await databases.listDocuments(
//     //     import.meta.env.VITE_APPWRITE_DATABASE_ID,
//     //     import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
//     // );
//     const usersCollection = collection(db, "users");
//     const usersSnapshot = await getDocs(usersCollection);
//     // Map Firestore documents to the UserData interface
//     return usersSnapshot.docs
//         .filter((doc) => !doc.id.startsWith("clerk:user_")) // <-- filter out Clerk users
//         .map((doc) => {
//             const data = doc.data();
//             return {
//                 id: doc.id,
//                 name: data.name || "Unknown User",
//                 position: data.jawatan || "Unknown Position",
//                 institution: data.institution || "Unknown Institution",
//                 faculty: data.fakulti || "Unknown Faculty",
//                 programName: data.programName || "Unknown Program",
//             } as UserData;
//         });

//     // const userData = usersResponse.documents.map((doc) => ({
//     //     id: doc.userId,
//     //     name: doc.name || "N/A",
//     //     institution: doc.institution || "",
//     //     faculty: doc.fakulti || "", // Mapping 'fakulti' to 'faculty'
//     //     programName: doc.programName || "N/A",
//     //     position: doc.jawatan || "N/A", // Mapping 'jawatan' to 'position'
//     // })) as UserData[];

//     // // Map and transform as needed.
//     // return userData;
// };

// export const useUsers = () => {
//     return useQuery<UserData[]>({
//         queryKey: ["users"],
//         queryFn: fetchUsers,
//         staleTime: 1000 * 60 * 5,
//     });
// };

//real-time data fetching with Firestore instead react-query
export const useUsers = () => {
    const [data, setData] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
            setData(snapshot.docs
                .filter((doc) => !doc.id.startsWith("clerk:user_"))
                .map((doc) => {
                    const d = doc.data();
                    return {
                        id: doc.id,
                        name: d.name || "Unknown User",
                        position: d.jawatan || "Unknown Position",
                        institution: d.institution || "Unknown Institution",
                        faculty: d.fakulti || "Unknown Faculty",
                        programName: d.programName || "Unknown Program",
                    } as UserData;
                })
            );
            setIsLoading(false);
        }
        , (error) => {
            setIsError(true);
            setError(error);
        }
    );
        return () => unsub();
    }, []);

    return { data, isLoading, isError, error };
};