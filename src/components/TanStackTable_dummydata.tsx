import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import mockData from "../../constants/dataTTanStack.json";
import {
  User,
  Mail,
  Phone,
  Hash,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react"; // ✅ Fixed Import
import { useTheme } from "../lib/contexts/ThemeContext";

type Person = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
};

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: () => (
      <div className="flex items-center">
        <Hash className="mr-2" size={16} /> ID
      </div>
    ),
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => (
      <div className="flex items-center">
        <User className="mr-2" size={16} /> Name
      </div>
    ),
  }),
  columnHelper.accessor("email", {
    cell: (info) => <div className="italic text-blue-600">{info.getValue()}</div>,
    header: () => (
      <div className="flex items-center">
        <Mail className="mr-2" size={16} /> Email
      </div>
    ),
  }),
  columnHelper.accessor("phone", {
    cell: (info) => info.getValue(),
    header: () => (
      <div className="flex items-center">
        <Phone className="mr-2" size={16} /> Phone
      </div>
    ),
  }),
];

export default function TanStackTable() {
  const [data] = React.useState(() => [...mockData]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const { isDarkMode } = useTheme();

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    initialState: { pagination: { pageSize: 5 } },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search the data"
          className="w-full pl-12 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-blue-400"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <Search className="absolute top-3 left-3 text-gray-400" size={20} />
      </div>

      <div className="min-w-fit overflow-x-auto rounded-lg">
        <table className="able-auto border-collapse divide-y divide-gray-200 font-sans">
          <thead className="bg-white dark:bg-indigo-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 flex-1 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap"
                  >
                    <button
                      className="cursor-pointer select-none flex items-center hover:outline-transparent hover:border-transparent"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown className="ml-2" size={14} />
                      </div>
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className={`bg-white dark:bg-gray-800 ${isDarkMode ? "divide-y divide-gray-800" : "divide-gray-200"}`}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue-400">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 flex-1 text-sm whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700 dark:text-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="mr-2">Items per page</span>
          <select
            className="border border-gray-300 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 p-2 text-gray-700"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={20} />
          </button>

          <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={20} />
          </button>

          <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>

          <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={20} />
          </button>

          <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
