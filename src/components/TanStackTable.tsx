import React, { useState, useId } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
const {
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
} = await import("lucide-react");
import { useTheme } from "@/lib/contexts/ThemeTypeContext";
import { SortDropdown } from "./ui/SortDropdown";
import type { UserData, ReportDocument } from "@/types/ReportTypes";
const { t } = await import("i18next");
import { SearchBar } from "./ui/search-table";
import { downloadToCSV } from "./DownloadtoCSV";

const userColumnHelper = createColumnHelper<UserData>();
const resultsColumnHelper = createColumnHelper<ReportDocument>();

// Table column definitions
const userColumns = [

  userColumnHelper.accessor("name", {
    id: "name",
    header: t("Name"),
    cell: (info) => {
      const value = info.getValue() as string;
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  }),
  userColumnHelper.accessor("institution", {
    id: "institution",
    header: t("Institution"),
    cell: (info) => info.getValue().toUpperCase(),
  }),
  userColumnHelper.accessor("faculty", {
    id: "faculty",
    header: t("Faculty"),
    cell: (info) => info.getValue().toUpperCase(),
  }),
  userColumnHelper.accessor("programName", {
    id: "programName",
    header: t("Program Name"),
    cell: (info) => info.getValue(),
  }),
  userColumnHelper.accessor("position", {
    id: "position",
    header: t("Position"),
    cell: (info) => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1),
  }),
];

const resultsColumns = [

  resultsColumnHelper.accessor("totalScore", {
    id: "totalScore",
    header: t("Total Score"),
    cell: (info) => {
      const value = info.getValue() as number; // Explicitly cast to number
      return value !== undefined ? value : "0";
    },
  }),
  resultsColumnHelper.accessor("completed_at", {
    id: "completed_at",
    header: t("Completed At"),
    cell: (info) => {
      const value = info.getValue() as string;
      if (typeof value === "string") {
        const date = new Date(value);
        return `${date.toLocaleDateString()},${date.toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" })}`;
      }
      return "Invalid Date";
    },
  }),
  resultsColumnHelper.accessor("programName", {
    id: "programme",
    header: t("Program"),
    cell: (info) => {
      const value = info.getValue() as string;
      return value || "Unknown Program";
    },
  }),
];

// Accept data as props instead of fetching inside
export function TanStackTable({ userData, reportData, refreshData }: { userData: UserData[], reportData: ReportDocument[], refreshData: () => void }) {
  const [userGlobalFilter, setUserGlobalFilter] = useState<string>("");
  const [resultsGlobalFilter, setResultsGlobalFilter] = useState<string>("");
  const [userSorting, setUserSorting] = useState<SortingState>([]);
  const [resultsSorting, setResultsSorting] = useState<SortingState>([]);
  const [userPageSize, setUserPageSize] = useState<number>(5);
  const [resultsPageSize, setResultsPageSize] = useState<number>(5);
  const [userPageIndex, setUserPageIndex] = useState<number>(0);
  const [resultsPageIndex, setResultsPageIndex] = useState<number>(0);

  return (
    <div className="min-w-fit overflow-x-auto rounded-lg">

      {/* Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t("Evaluator Data")}</h3>
        <button
          onClick={refreshData} // Call the refreshData function
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {t("Refresh")}
        </button>
      </div>

      <div className="w-full flex justify-between items-center">
        <SearchBar value={userGlobalFilter} onChange={setUserGlobalFilter} placeholder="Search..." />
        {/* Sort Dropdown */}
        <SortDropdown columns={userColumns as unknown as { id: string; header?: string | (() => React.ReactNode) }[]} sorting={userSorting} setSorting={setUserSorting} />

      </div>

      <h3 className="text-lg font-semibold my-4">{t("Evaluator Data")}</h3>
      <TableComponent
        data={userData}
        columns={userColumns}
        globalFilter={userGlobalFilter}
        sorting={userSorting}
        setSorting={setUserSorting}
        pageSize={userPageSize}
        setPageSize={setUserPageSize}
        pageIndex={userPageIndex}
        setPageIndex={setUserPageIndex}
      />
      <div className="h-8"></div>

      {/* Assessment Results Header */}
      <div className="w-full flex justify-between items-center">
        <SearchBar
          value={resultsGlobalFilter}
          onChange={setResultsGlobalFilter}
          placeholder="Search..."
        />
        <SortDropdown
          columns={resultsColumns as unknown as { id: string; header?: string | (() => React.ReactNode) }[]}
          sorting={resultsSorting}
          setSorting={setResultsSorting}
        />
      </div>
      <h3 className="text-lg font-semibold my-4">{t("Assessment Results")}</h3>
      <TableComponent
        data={reportData}
        columns={resultsColumns}
        globalFilter={resultsGlobalFilter}
        sorting={resultsSorting}
        setSorting={setResultsSorting}
        pageSize={resultsPageSize}
        setPageSize={setResultsPageSize}
        pageIndex={resultsPageIndex}
        setPageIndex={setResultsPageIndex}
      />
    </div>
  );
}

function TableComponent<T extends UserData | ReportDocument | Record<string, unknown>>({
  data,
  columns,
  globalFilter,
  sorting,
  setSorting,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
}: {
  data: T[];
  columns: ColumnDef<T, any>[];
  globalFilter: string;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}) {

  const tableConfig = React.useMemo(() => ({
    data,
    columns,
    state: { sorting, globalFilter, pagination: { pageSize, pageIndex } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
  }), [data, columns, sorting, globalFilter, pageSize, pageIndex, setSorting]);

  const table = useReactTable(tableConfig);
  const { isDarkMode } = useTheme();
  const pageSizeId = useId();
  const selectBoxId = useId();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const toggleAllRows = () => {
    const currentRowIds = table.getRowModel().rows.map((row) => row.id);
    const areAllSelected = currentRowIds.every((id) => selectedRows.includes(id));
    if (areAllSelected) {
      // remove all
      setSelectedRows((prev) => prev.filter((id) => !currentRowIds.includes(id)));
    } else {
      // add missing row ids
      setSelectedRows((prev) => Array.from(new Set([...prev, ...currentRowIds])));
    }
  };



  const handleDownload = () => {
    // Cast to Record<string, unknown> since we know our data structure is compatible
    downloadToCSV({ table, selectedRows } as unknown as {
      table: any,
      selectedRows: string[]
    });
    setSelectedRows([]);
  }

  return (
    <div className="min-w-fit">
      {/* Sorting */}
      {/* <div className="flex justify-end items-center mb-2">
        <SortDropdown columns={columns} sorting={sorting} setSorting={setSorting} />
      </div> */}

      {/* Table */}
      <div className="min-w-fit overflow-x-auto rounded-xl">
        <table className="border-collapse divide-y divide-gray-200 font-sans w-[1120px]">
          <thead className="bg-white dark:bg-indigo-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {/* Selection Header */}
                <th className="p-3">
                  <input
                    id={`select-all-${selectBoxId}`}
                    type="checkbox"
                    onChange={toggleAllRows}
                    checked={
                      table.getRowModel().rows.length > 0 &&
                      table.getRowModel().rows.every((row) => selectedRows.includes(row.id))
                    }
                  />
                </th>
                {
                  // table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-3 text-left text-xs font-medium">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))
                  // )
                }
              </tr>
            ))}
          </thead>
          <tbody className={`bg-white divide-y dark:bg-gray-800 divide-gray-200 ${isDarkMode ? "divide-gray-800" : "divide-gray-200"}`}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {/* selection checkbox */}
                <td className="p-3">
                  <input
                    id={`"select-one-${selectBoxId}-${row.id}`}
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={(e) => {
                      // Prevent the row click from toggling immediately.
                      e.stopPropagation();
                      toggleRowSelection(row.id);
                    }}
                  />
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 break-words whitespace-normal">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">

        {/* Items Per Page Selection */}
        <div className="flex items-center gap-2">
          <label htmlFor={`pageSize-${pageSizeId}`} className="text-sm">
            Rows per page:
          </label>
          <select
            id={`pageSize-${pageSizeId}`}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded p-1"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size} className="dark:bg-gray-800">
                {size}
              </option>
            ))}
          </select>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>
            <ChevronsLeft size={20} />
          </button>
          <button onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))} disabled={pageIndex === 0}>
            <ChevronLeft size={20} />
          </button>
          <span>Page {pageIndex + 1} of {table.getPageCount()}</span>
          <button onClick={() => setPageIndex((prev) => Math.min(prev + 1, table.getPageCount() - 1))} disabled={pageIndex >= table.getPageCount() - 1}>
            <ChevronRight size={20} />
          </button>
          <button onClick={() => setPageIndex(table.getPageCount() - 1)} disabled={pageIndex >= table.getPageCount() - 1}>
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>

      {/* Snackbar for row actions */}
      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded shadow flex items-center gap-3 z-50">
          <span>Row {selectedRows.length} row{selectedRows.length > 1 ? "s" : ""} selected</span>

          <button onClick={handleDownload} className="text-green-400 hover:underline">
            Download CSV
          </button>
          <button onClick={() => setSelectedRows([])} className="ml-auto">
            X
          </button>
        </div>
      )}
    </div>
  );
}

// userColumnHelper.accessor("faculty", {
//   id: "faculty",
//   header: t("Faculty"),
//   cell: (info) => info.getValue().toUpperCase(),
// }),

// resultsColumnHelper.accessor("faculty", {
//   id: "faculty",
//   header: t("Faculty"),
//   cell: (info) => {
//     const value = info.getValue() as string;
//     return value || "Unknown Faculty";
//   },
// }),

// userColumnHelper.accessor("id", {
//   id: "id",
//   header: t("ID"),
//   cell: (info) => info.getValue(),
// }),

// resultsColumnHelper.accessor("userId", {
//   id: "userId",
//   header: t("User ID"),
//   cell: (info) => info.getValue(),
// }),

// const handleEdit = () => {
//   setSelectedRows([]);
// }

// const handleDelete = () => {
//   setSelectedRows([]);
// };
{/* <button onClick={handleEdit} className="text-blue-400 hover:underline">
    Edit
          </button>
          <button onClick={handleDelete} className="text-red-400 hover:underline">
            Delete
          </button> */}