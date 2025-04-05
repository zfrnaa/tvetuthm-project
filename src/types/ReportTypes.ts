export interface ReportDocument {
  totalScore?: number;
  completed_at: string;
  faculty?: string;
  userId?: string;
  clusterScores?: string[];
  cippScores?: string[];
  programName: string
  programId: string;
}

export interface UserData {
  id: string;
  name: string;
  position: string;
  institution: string;
  faculty: string;
  programName?: string;
  // Add other fields as necessary
}

export interface VisitorData{
  visited_at: string;
  status: string;
}

// const fetchResults = async () => {
//   const reportResponse = await databases.listDocuments(
//     import.meta.env.VITE_APPWRITE_DATABASE_ID,
//     import.meta.env.VITE_APPWRITE_RESULTS_COLLECTION_ID
//   );
//   const usersResponse = await databases.listDocuments(
//     import.meta.env.VITE_APPWRITE_DATABASE_ID,
//     import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
//   );
//   const programsResponse = await databases.listDocuments(
//     import.meta.env.VITE_APPWRITE_DATABASE_ID,
//     import.meta.env.VITE_APPWRITE_PROGRAMS_COLLECTION_ID
//   );

//   // Map user documents to your UserData format
//   const userData = usersResponse.documents.map((doc) => ({
//     id: doc.userId,
//     name: doc.name || "N/A",
//     institution: doc.institution || "",
//     faculty: doc.fakulti || "", // Mapping 'fakulti' to 'faculty'
//     programName: doc.programName || "N/A",
//     position: doc.jawatan || "N/A", // Mapping 'jawatan' to 'position'
// })) as UserData[];

//   // Merge each report with the corresponding user faculty (using userId)
//   const reportData = reportResponse.documents as unknown as ReportDocument[];
//   const mergedReportData = reportData.map((report) => {
//     // Try to find the matching user by userId
//     const matchedUser = report.userId ? userData.find((user) => user.id === report.userId) : undefined;
//     return {
//       ...report, faculty: matchedUser ? matchedUser.faculty : report.faculty || "N/A",
//     };
//   });

//   return {
//     mergedReportData: mergedReportData,
//     userData: userData,
//     programData: programsResponse.documents,
//   };
// };

// const useFetchResults = () => {
//   return useQuery({ queryKey: ["fetchResults"], queryFn: fetchResults });
// };

// export default useFetchResults;