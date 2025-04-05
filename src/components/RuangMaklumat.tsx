import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react"; // ✅ Fixed Import
import { starDescriptions, tableKluster, tableCIPP, headerKluster, headerCIPP } from "../../model/information";
import { useTranslation } from "react-i18next";

const RuangMaklumat = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  const { t } = useTranslation();


  return (
    <div className="flex flex-col items-center justify-center">
      <div>

        <h2 className="text-2xl font-semibold mb-8 dark:text-gray-200">{t("Assessment Details Star")}</h2>
      </div>

      <div className="w-full max-w-3xl p-8 bg-white/50 backdrop-blur-md shadow-blue-100 rounded-2xl shadow-md mb-8">
        {starDescriptions.map(({ stars, text, description }, index) => (
          <div key={text} className="mb-4">
            <button onClick={() => toggleExpand(index)} className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center">
                <div className="flex flex-row">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="text-yellow-400" fill="orange" color="lightorange" />
                  ))}
                </div>
                <span className={`ml-4 text-lg ${expandedIndex === index ? "text-black dark:text-gray-200" : "text-gray-800 dark:text-gray-800"}`}>
                  {t(text)}
                </span>
              </div>
              {expandedIndex === index ? <ChevronUp className="bg-gray-400" /> : <ChevronDown className="text-gray-700" />}
            </button>
            {expandedIndex === index && <p className="ml-2 mt-2 text-gray-700 text-justify text-base dark:text-gray-200">{t(description)}</p>}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-8">{t("Score by Cluster")}</h2>
      <div className="p-4 bg-white/50 backdrop-blur-md shadow-blue-100 rounded-2xl shadow-md">
        <div className="w-full overflow-x-auto rounded-lg">

          <table className="table-auto divide-y divide-gray-200">
            <thead>
              <tr className="w-auto bg-blue-200 dark:bg-gray-600 rounded-md">
                {headerKluster.map((col) => (
                  <th key={col.label} className="py-2 px-4">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {tableKluster.map((row, index) => (
                <tr key={index}>
                  <td className="py-2 px-4">{row.component}</td>
                  <td className="py-2 px-4">{row.score}</td>
                  <td className="py-2 px-4">{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-8 mt-8">Skor Mengikut CIPP</h2>
      <div className="w-full max-w-lg p-4 bg-white/50 backdrop-blur-md shadow-blue-100 rounded-2xl shadow-md">
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-blue-200 dark:bg-gray-600">
                {headerCIPP.map((col) => (
                  <th key={col.label} className="py-2 px-4">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {tableCIPP.map((row, index) => (
                <tr key={index} >
                  <td className="py-2 px-4">{row.component}</td>
                  <td className="py-2 px-4">{row.score}</td>
                  <td className="py-2 px-4">{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RuangMaklumat;
