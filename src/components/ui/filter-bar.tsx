"use client";

import React from "react";
import { FilterDropdown } from "./forms/filter-dropdown";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterBarProps {
  activeFilters: {
    institution: string[];
    faculty: string[];
    programName: string[];
  };
  setActiveFilters: React.Dispatch<
    React.SetStateAction<{
      institution: string[];
      faculty: string[];
      programName: string[];
    }>
  >;
  predefinedData: {
    institution: string[];
    faculty: string[];
    programName: { id: string; name: string }[];
  };
}

export function FilterBar({
  activeFilters,
  setActiveFilters,
  predefinedData,
}: FilterBarProps) {

  const handleFilterChange = (key: keyof typeof activeFilters, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      institution: [],
      faculty: [],
      programName: [],
    });
  };

  const hasActiveFilters = Object.values(activeFilters).some((filters) => filters.length > 0);

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <FilterDropdown
          title="Institusi"
          options={predefinedData.institution.map((inst) => ({ id: inst, name: inst }))}
          selectedValues={activeFilters.institution}
          onChange={(values) => handleFilterChange("institution", values)}
        />
        <FilterDropdown
          title="Fakulti"
          options={predefinedData.faculty.map((fac) => ({ id: fac, name: fac }))}
          selectedValues={activeFilters.faculty}
          onChange={(values) => handleFilterChange("faculty", values)}
        />
        <FilterDropdown
          title="Program"
          options={predefinedData.programName.map((prog) => ({
            id: prog.id,
            name: prog.name,
          }))}
          selectedValues={activeFilters.programName}
          onChange={(values) => handleFilterChange("programName", values)}
        />

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="flex items-center gap-1 h-9">
            <X className="h-4 w-4" />
            Bersihkan Semua
          </Button>
        )}
      </div>
    </div>
  );
}