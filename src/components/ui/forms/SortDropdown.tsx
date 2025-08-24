import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { SortingState } from "@tanstack/react-table";

interface SortDropdownProps {
  columns: {
    id: string;
    header?: string | (() => React.ReactNode);
    columnDef?: { header?: string | (() => React.ReactNode) };
  }[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ columns, sorting, setSorting }) => {
  // Get current sorted column header (assumes single sort)
  const sortedColumn = sorting[0] ? columns.find(col => col.id === sorting[0].id) : null;
  const sortedHeader = sortedColumn &&
    (typeof sortedColumn.header === "function"
      ? sortedColumn.header()
      : sortedColumn.header ||
        (typeof sortedColumn.columnDef?.header === "function"
          ? sortedColumn.columnDef.header()
          : sortedColumn.columnDef?.header));
  const sortedOrder = sorting[0]?.desc ? "menurun" : "menaik";

  // Toggle sort for a column: if already sorted ascending then switch to descending, else set ascending.
  const handleToggleSort = (columnId: string) => {
    const currentSort = sorting.find(sort => sort.id === columnId);
    if (currentSort) {
      // Toggle between ascending and descending.
      setSorting([{ id: columnId, desc: !currentSort.desc }]);
    } else {
      // If not sorted, set ascending by default.
      setSorting([{ id: columnId, desc: false }]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
            {sortedHeader ? `${"Susun"}: ${sortedHeader} (${sortedOrder})` : "Susun"}
          <ArrowUpDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-2">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-left"
            onClick={() => setSorting([])}
          >
            Kosongkan Susunan
          </Button>
          {columns.map((col) => {
            const headerName =
              typeof col.header === "function"
                ? col.header()
                : col.header ||
                  (typeof col.columnDef?.header === "function"
                    ? col.columnDef.header()
                    : col.columnDef?.header) ||
                  "";
            // Check if this column is currently sorted and its order.
            const currentSort = sorting.find(sort => sort.id === col.id);
            const isSortedAsc = currentSort && !currentSort.desc;
            const isSortedDesc = currentSort && currentSort.desc;

            return (
              <Button
                key={col.id}
                variant="ghost"
                size="sm"
                className={`w-full text-left ${isSortedAsc || isSortedDesc ? "bg-blue-100" : ""}`}
                onClick={() => handleToggleSort(col.id)}
              >
                {headerName} {isSortedAsc ? "↑" : isSortedDesc ? "↓" : ""}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};