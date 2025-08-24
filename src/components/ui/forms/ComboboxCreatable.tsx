import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/navigation/command"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Option {
    value: string;
    label: string;
}

interface ComboboxCreatableProps {
    options: Option[];
    value: string; // The currently selected or typed value
    onChange: (value: string) => void; // Function to call when value changes
    placeholder?: string;
    searchPlaceholder?: string;
    notFoundMessage?: string;
    createLabel?: string;
    itemTypeLabel?: string;
    className?: string;
    maxInitialItems?: number;
    creatable?: boolean;
}

export function ComboboxCreatable({
    options,
    value,
    onChange,
    placeholder = "Select or type...",
    searchPlaceholder = "Search or create...",
    notFoundMessage = "No matching option found.",
    itemTypeLabel = "item",
    className,
    maxInitialItems,
    creatable = true,
}: ComboboxCreatableProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleSelect = (selectedValue: string) => {
        const newValue = selectedValue === value ? "" : selectedValue;
        onChange(newValue.trim()); // Trim whitespace just in case
        setSearchQuery("");
        setOpen(false);
    };

    // Filter options based on search query
    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) {
            // If no search query and maxInitialItems is set, show only the first few
            return maxInitialItems ? options.slice(0, maxInitialItems) : options;
        }
        // Otherwise, filter all options based on the search query (case-insensitive)
        return options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery, maxInitialItems]);

    const isShowingLimited = !searchQuery && maxInitialItems && options.length > maxInitialItems;

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between truncate", !value && "text-muted-foreground", className)}
                    aria-label="Select or type an option"
                >
                    {value
                        ? options.find((option) => option.value === value)?.label ?? value // Show label if found, else show raw value
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-0 w-full max-h-[--radix-popover-content-available-height] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                <Command loop filter={(value, search) => {
                    const option = options.find(opt => opt.value === value);
                    if (option && option.label.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onValueChange={setSearchQuery} // Update local input state
                        onKeyDown={(e) => {
                            if (creatable && e.key === 'Enter' && searchQuery.trim()) {
                                const highlightedValue = (e.target as HTMLElement)?.closest('[cmdk-root]')?.querySelector('[aria-selected="true"]')?.getAttribute('data-value');
                                // Only create if no item is highlighted/selected
                                if (!highlightedValue) {
                                    handleSelect(searchQuery.trim());
                                }
                            }
                        }}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {creatable && searchQuery.trim() ? (
                                <div className="flex items-center justify-center text-sm text-muted-foreground py-4 px-2 text-center">
                                    <PlusCircle className="mr-2 h-4 w-4 shrink-0" />
                                    <span>
                                        Tiada padanan. Tekan Enter untuk menambah {itemTypeLabel} baru.
                                    </span>
                                </div>
                            ) : (
                                <div className="py-4 text-center text-sm text-muted-foreground">
                                    {notFoundMessage}
                                </div>
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {/* Map over the potentially sliced or filtered options */}
                            {filteredOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value} // Use value for cmdk matching
                                    onSelect={() => handleSelect(option.value)}
                                    className="whitespace-normal cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 shrink-0",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                            {/* Optional: Add a message if the list is truncated */}
                            {isShowingLimited && (
                                <div className="py-2 px-4 text-center text-xs text-muted-foreground">
                                    Taip untuk mencari lebih banyak {itemTypeLabel}...
                                </div>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}