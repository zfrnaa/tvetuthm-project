import { useState, useEffect, useRef } from "react";

export function MultiSelectDropdown({
  label,
  options,
  selectedOptions,
  setSelectedOptions,
}: {
  label: string;
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (values: string[] | ((prevValues: string[]) => string[])) => void;
}) {
  const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)} // Toggle dropdown visibility
        className="border rounded p-2 bg-white dark:bg-gray-800"
      >
        {label}
      </button>
      {isOpen && ( // Render dropdown only when `isOpen` is true
        <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 z-10">
          <div className="py-1">
            {options.map((option) => (
              <label key={option} className="flex items-center px-4 py-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}