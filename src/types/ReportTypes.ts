export interface ReportDocument {
  id?: string;
  totalScore?: number;
  completed_at: string;
  faculty: string;
  institution: string;
  userId?: string;
  clusterScores?: string[];
  cippScores?: string[];
  programName: string;
  starRating?: number;
  programId: string;
}

export interface ProgramsData{
  id: string;
  programId: string;
  programName: string;
  starRating: number;
}

export interface UserData {
  id: string;
  name: string;
  position: string;
  institution: string;
  faculty: string;
  programName?: string;
  // programId?: string;
}

export interface VisitorData{
  visited_at: string;
  status: string;
}

// const useFetchResults = () => {
//   return useQuery({ queryKey: ["fetchResults"], queryFn: fetchResults });
// };

// export default useFetchResults;