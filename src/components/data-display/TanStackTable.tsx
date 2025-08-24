"use client"

import React, { useState, useId, useMemo } from "react"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table"
const { ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft } = await import("lucide-react")

import { SortDropdown } from "../ui/forms/SortDropdown"
import type { UserData, ReportDocument, ProgramsData } from "@/types/ReportTypes"
import { SearchBar } from "./search-table"
import { downloadToCSV } from "../features/DownloadtoCSV"
// import { predefinedUniversities, predefinedPrograms, predefinedFaculties } from "../../constants/programsUFac";
import { FilterBar } from "../ui/filter-bar";
// import { getFacultyShortName } from "@/lib/utils/facultyShortName";
// import { get } from "lodash"

const userColumnHelper = createColumnHelper<UserData>()
const resultsColumnHelper = createColumnHelper<ReportDocument>()

// Accept data as props instead of fetching inside
export function TanStackTable({
  userData,
  reportData,
  programData,
}: {
  userData: UserData[]; reportData: ReportDocument[]; programData: ProgramsData[];
}) {

  // Table column definitions
  const userColumns = [
    userColumnHelper.accessor("name", {
      id: "name",
      header: "Nama",
      cell: (info) => {
        const value = info.getValue() as string
        return value.charAt(0).toUpperCase() + value.slice(1)
      },
    }),
    userColumnHelper.accessor("institution", {
      id: "institution",
      header: "Institusi",
      cell: (info) => info.getValue().toUpperCase(),
    }),
    userColumnHelper.accessor("faculty", {
      id: "faculty",
      header: "Fakulti",
      cell: (info) => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1),
    }),
    userColumnHelper.accessor("programName", {
      id: "programName",
      header: "Nama Program",
      cell: (info) => info.getValue(),
    }),
    userColumnHelper.accessor("position", {
      id: "position",
      header: "Jawatan",
      cell: (info) => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1),
    }),
  ]

  const resultsColumns = [
    resultsColumnHelper.accessor("programName", {
      id: "programme",
      header: "Program",
      cell: (info) => {
        const value = info.getValue() as string
        return value || "Unknown Program"
      },
    }),
    resultsColumnHelper.accessor("totalScore", {
      id: "totalScore",
      header: "Jumlah Markah",
      cell: (info) => {
        const value = info.getValue() as number // Explicitly cast to number
        return value !== undefined ? value : "0"
      },
    }),
    resultsColumnHelper.accessor("starRating", {
      id: "starRating",
      header: "Penarafan Bintang",
      cell: (info) => `${info.getValue() || 0} ⭐`,
    }),
    resultsColumnHelper.accessor("completed_at", {
      id: "completed_at",
      header: "Selesai Pada",
      cell: (info) => {
        const value = info.getValue();
        let date: Date | null = null;
        if (value && typeof value === "object" && typeof (value as any).seconds === "number") {
          date = new Date((value as any).seconds * 1000);
        }

        if (date && !isNaN(date.getTime())) {
          return `${date.toLocaleDateString()}, ${date.toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" })}`;
        }
        return "Tarikh tidak sah";
      },
    }),
  ]

  const [userGlobalFilter, setUserGlobalFilter] = useState<string>("")
  const [resultsGlobalFilter, setResultsGlobalFilter] = useState<string>("")

  const [userSorting, setUserSorting] = useState<SortingState>([])
  const [resultsSorting, setResultsSorting] = useState<SortingState>([
    { id: "completed_at", desc: true }
  ])
  const [userPageSize, setUserPageSize] = useState<number>(5)
  const [resultsPageSize, setResultsPageSize] = useState<number>(5)
  const [userPageIndex, setUserPageIndex] = useState<number>(0)
  const [resultsPageIndex, setResultsPageIndex] = useState<number>(0)

  // Active filters state
  const [activeFilters, setActiveFilters] = useState({
    institution: [] as string[],
    faculty: [] as string[],
    programName: [] as string[],
  });

  // 1. Unique Institutions from userData
  const uniqueInstitutions = useMemo(() => {
    const institutions = new Set(userData.map(user => user.institution).filter(Boolean));
    return Array.from(institutions).sort();
  }, [userData]);

  // 2. Unique Faculties (short names) from userData
  const uniqueFaculties = useMemo(() => {
    const faculties = new Set(userData.map(user => user.faculty).filter(Boolean));
    return Array.from(faculties).sort();
  }, [userData]);

  // 3. Unique Programs from reportData (using programsData for names)
  const uniquePrograms = useMemo(() => {
    if (!Array.isArray(reportData) || !Array.isArray(programData)) return [];
    const programIds = new Set(reportData.map(report => report.programId).filter(Boolean));
    const programsMap = new Map(programData.map(p => [p.programId, p.programName]));

    const uniqueProgramList = Array.from(programIds).map(id => ({
      id: id!, // Assert non-null as we filtered Boolean
      name: programsMap.get(id!) || `Unknown Program (${id})`, // Get name or show ID
    })).sort((a, b) => a.name.localeCompare(b.name)); // Sort by name

    return uniqueProgramList;
    // Note: FilterBar might expect an array of strings (names) or {id, name}.
    // If it expects only names: return uniqueProgramList.map(p => p.name);
    // If it expects {id, name}, this is correct.
  }, [reportData, programData]);

  const filteredUserData = useMemo(() => {
    return userData.filter((user) => {
      const matchingReport = reportData.find((report) => report.userId === user.id);
      const programId = matchingReport?.programId;

      const matchesInstitution =
        activeFilters.institution.length === 0 ||
        activeFilters.institution.includes(user.institution);
      const matchesFaculty =
        activeFilters.faculty.length === 0 ||
        activeFilters.faculty.includes(user.faculty);
      const matchesProgram =
        activeFilters.programName.length === 0 ||
        (programId && activeFilters.programName.includes(programId));
      return matchesInstitution && matchesFaculty && matchesProgram;
    });
  }, [userData, reportData, activeFilters]);

  return (
    <div className="min-w-fit overflow-x-auto rounded-lg">
      <h3 className="text-lg font-semibold my-4">Data Penilai</h3>

      {/* User Filters */}
      <FilterBar activeFilters={activeFilters} setActiveFilters={setActiveFilters} predefinedData={{
        institution: uniqueInstitutions,
        faculty: uniqueFaculties,
        programName: uniquePrograms,
      }} />

      <div className="w-full flex justify-between items-center mb-4">
        <SearchBar value={userGlobalFilter} onChange={setUserGlobalFilter} placeholder="Cari..." />
        {/* Sort Dropdown */}
        <SortDropdown
          columns={userColumns as unknown as { id: string; header?: string | (() => React.ReactNode) }[]}
          sorting={userSorting}
          setSorting={setUserSorting}
        />
      </div>

      <TableComponent
        data={filteredUserData}
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
      <h3 className="text-lg font-semibold my-4">Keputusan Penilaian</h3>

      <div className="w-full flex justify-between items-center mb-4">
        <SearchBar value={resultsGlobalFilter} onChange={setResultsGlobalFilter} placeholder="Cari..." />
        <SortDropdown
          columns={resultsColumns as unknown as { id: string; header?: string | (() => React.ReactNode) }[]}
          sorting={resultsSorting}
          setSorting={setResultsSorting}
        />
      </div>

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
  )
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
  data: T[]
  columns: ColumnDef<T, any>[]
  globalFilter: string
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  pageSize: number
  setPageSize: React.Dispatch<React.SetStateAction<number>>
  pageIndex: number
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
}) {
  const tableConfig = React.useMemo(
    () => ({
      data,
      columns,
      state: { sorting, globalFilter, pagination: { pageSize, pageIndex } },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
    }),
    [data, columns, sorting, globalFilter, pageSize, pageIndex, setSorting],
  )

  const table = useReactTable(tableConfig)
  const pageSizeId = useId()
  const selectBoxId = useId()

  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
  }

  const toggleAllRows = () => {
    const currentRowIds = table.getRowModel().rows.map((row) => row.id)
    const areAllSelected = currentRowIds.every((id) => selectedRows.includes(id))
    if (areAllSelected) {
      // remove all
      setSelectedRows((prev) => prev.filter((id) => !currentRowIds.includes(id)))
    } else {
      // add missing row ids
      setSelectedRows((prev) => Array.from(new Set([...prev, ...currentRowIds])))
    }
  }

  const handleDownload = () => {
    // Cast to Record<string, unknown> since we know our data structure is compatible
    downloadToCSV({ table, selectedRows } as unknown as {
      table: any
      selectedRows: string[]
    })
    setSelectedRows([])
  }

  return (
    <div className="min-w-fit">
      {/* Table */}
      <div className="min-w-fit overflow-x-auto rounded-xl">
        <table className="border-collapse divide-y divide-gray-200 font-sans max-w-[1160px] w-full">
          <thead className="bg-white dark:bg-indigo-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {/* Selection Header */}
                <th className="p-3 bg-blue-300">
                  <input
                    id={`select-all-${selectBoxId}`}
                    type="checkbox"
                    onChange={toggleAllRows}
                    checked={
                      table.getRowModel().rows.length > 0 &&
                      table.getRowModel().rows.every((row) => selectedRows.includes(row.id))
                    }
                    aria-label="select all rows"
                  />
                </th>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 text-left uppercase text-xs font-bold bg-blue-300">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            className="bg-white divide-y divide-gray-200"
          >
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
                      e.stopPropagation()
                      toggleRowSelection(row.id)
                    }}
                    aria-label={`select row ${row.id}`}
                  />
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 break-words whitespace-normal gantari">
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
            Baris setiap halaman:
          </label>
          <select
            id={`pageSize-${pageSizeId}`}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded p-1"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0} aria-label="first page">
            <ChevronsLeft size={20} />
          </button>
          <button onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))} disabled={pageIndex === 0} aria-label="previous page">
            <ChevronLeft size={20} />
          </button>
          <span>
            Halaman {pageIndex + 1} daripada {table.getPageCount()}
          </span>
          <button
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, table.getPageCount() - 1))}
            disabled={pageIndex >= table.getPageCount() - 1} aria-label="next page"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setPageIndex(table.getPageCount() - 1)}
            disabled={pageIndex >= table.getPageCount() - 1} aria-label="last page"
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>

      {/* Snackbar for row actions */}
      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded shadow flex items-center gap-3 z-50">
          <span>
            Row {selectedRows.length} row{selectedRows.length > 1 ? "s" : ""} selected
          </span>

          <button onClick={handleDownload} className="text-green-400 hover:underline">
            Download CSV
          </button>
          <button onClick={() => setSelectedRows([])} className="ml-auto">
            X
          </button>
        </div>
      )}
    </div>
  )
}