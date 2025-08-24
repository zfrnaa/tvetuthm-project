import React, { useId } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Search..." }) => {
    const getId = useId();

  return (
    <div className="w-full relative pr-4">
      <input
        id={`search-${getId}`}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-blue-400"
      />
      <Search className="absolute top-3 left-3 text-gray-400" size={20} />
    </div>
  );
};