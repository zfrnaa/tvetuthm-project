// import useFetchResults from "@/hooks/useFetchResults";
import { Card } from "@material-tailwind/react";
import { Star } from "lucide-react";

export const EvaluatedProgram = ({ programs }: any) => {
  // const { data, isLoading, error } = useFetchResults();

  if (!programs || programs.length === 0) {
    return <div>Loading programs...</div>;
  }
  // if (error) return <div>{error.message}</div>;

  // An optional 'starRating' field (number of stars evaluated)
  // const programs = data?.programData || [];
  // Only include programs with a starRating greater than 0 as evaluated.
  const evaluatedPrograms = programs.filter(
    (program: any) => program?.starRating && program.starRating > 0
  );

  return (
    <div className="md:min-w-2xl mx-auto p-4">
      {/* Section: Evaluated Programs */}
      {evaluatedPrograms.length === 0 ? (
        <div>No programs evaluated.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
          {evaluatedPrograms.map((program: any) => (
            <Card key={program.$id} className="border p-4 rounded-lg dark:bg-darkPrimary shadow-sm w-full">
              <h3 className="text-lg font-semibold mb-2">{program.programName}</h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    fill="currentColor"
                    size={16}
                    className={index < (program.starRating || 0) ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {program.starRating ? `${program.starRating}/5` : "Not rated"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Section: All Programs */}

    </div>
  );
};

export const AllPrograms = ({ programs }: { programs: any[] }) => {

  if (!programs) return <div>Loading programs...</div>;

  const getMs = (d: any): number => {
    if (d instanceof Date) return d.getTime();
    // fallback ISO‑string or other
    const dt = typeof d === "string" ? new Date(d) : new Date(d);
    return isNaN(dt.getTime()) ? 0 : dt.getTime();
  };

  // sort ascending so newest is at the bottom
  const sortedPrograms = [...programs].sort(
    (a, b) => getMs(a.createdAt) - getMs(b.createdAt)
  );

  return (
    <div>
      {
        sortedPrograms.length === 0 ? (
          <div>No programs registered.</div>
        ) : (
          <ol className="list-decimal pl-5 space-y-1">
            {sortedPrograms.map((program: any, idx: number) => (
              <li key={program.$id || program.id || idx} className="text-md text-justify">{program.programName}</li>
            ))}
          </ol>
        )
      }
    </div>
  )
}