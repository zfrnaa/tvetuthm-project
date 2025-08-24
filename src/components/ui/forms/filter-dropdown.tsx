"use client"

import type React from "react"
import { useState } from "react"
import { Check, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/forms/dropdown-menu"

interface FilterDropdownProps {
  title: string;
  options: { id: string; name: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function FilterDropdown({ title, options, selectedValues, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((item) => item !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const clearFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-9">
          <Filter className="h-4 w-4" />
          {title}
          {selectedValues.length > 0 && (
            <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
              {selectedValues.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="font-medium">{title}</span>
          {selectedValues.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
              Clear
            </Button>
          )}
        </div>
        {options.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
        ) : (
          options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={selectedValues.includes(option.id)}
              onSelect={(e) => {
                e.preventDefault();
                handleSelect(option.id);
              }}
              className="capitalize"
            >
              {option.name || "Unnamed"}
              {selectedValues.includes(option.id) && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}