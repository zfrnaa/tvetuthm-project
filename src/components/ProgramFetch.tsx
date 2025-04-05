// import useFetchResults from "@/hooks/useFetchResults";
import { Card } from "@material-tailwind/react";
import { t } from "i18next";
import { Star } from "lucide-react";

export const EvaluatedProgram = ({programs}: any) => {
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
    <div className="max-w-xl mx-auto p-4">
      {/* Section: Evaluated Programs */}
      <h2 className="text-xl font-bold mb-4">{t("Evaluated Programs")}</h2>
      {evaluatedPrograms.length === 0 ? (
        <div>No programs evaluated.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
          {evaluatedPrograms.map((program: any) => (
            <Card key={program.$id} className="border p-4 rounded-lg bg-white shadow-sm w-full">
              <h3 className="text-lg font-semibold mb-2">{t(program.program_name)}</h3>
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

export const AllPrograms = ({programs} : { programs: any[] }) => {
  // Fetch program list data for total registered programs
  // const { data: fetchResults, isLoading: isResultsLoading, error } = useFetchResults();
  // const programs = fetchResults?.programData || [];

  // if (isResultsLoading) return <div>Loading programs...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  if (!programs) return <div>Loading programs...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mt-8 mb-4">All Programs</h2>
      {
        programs.length === 0 ? (
          <div>No programs registered.</div>
        ) : (
          <ol className="list-decimal pl-5 space-y-1">
            {programs.map((program: any) => (
              <li key={program.$id} className="text-md text-justify">{t(program.program_name)}</li>
            ))}
          </ol>
        )
      }
    </div>
  )
}