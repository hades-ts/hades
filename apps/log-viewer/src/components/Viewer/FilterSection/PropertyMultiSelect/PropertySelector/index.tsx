import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PropertySelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPropertiesArray: string[];
    availableProperties: string[];
    properties: Record<string, Set<string>>;
    selectedProperties: Set<string>;
    activeFilters: Record<string, Set<string>>;
    togglePropertySelection: (property: string) => void;
}

export default function PropertySelector({
    open,
    onOpenChange,
    selectedPropertiesArray,
    availableProperties,
    properties,
    selectedProperties,
    activeFilters,
    togglePropertySelection,
}: PropertySelectorProps) {
    const hasActiveFilters = (property: string) => {
        return activeFilters[property] && activeFilters[property].size > 0;
    };

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-slate-800 border-slate-700 hover:bg-slate-700"
                >
                    {selectedPropertiesArray.length > 0
                        ? `${selectedPropertiesArray.length} properties selected`
                        : "Select properties..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-slate-900 border-slate-700">
                <Command className="bg-slate-900">
                    <CommandInput
                        placeholder="Search properties..."
                        className="border-slate-700"
                    />
                    <CommandList>
                        <CommandEmpty>No properties found.</CommandEmpty>
                        <CommandGroup>
                            {availableProperties.map((property) => {
                                const isSelected =
                                    selectedProperties.has(property);
                                const hasFilters = hasActiveFilters(property);

                                return (
                                    <CommandItem
                                        key={property}
                                        value={property}
                                        onSelect={() => {
                                            togglePropertySelection(property);
                                        }}
                                        className="flex items-center justify-between p-2 hover:bg-slate-800"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={cn(
                                                    "flex h-4 w-4 items-center justify-center rounded-sm border border-slate-600",
                                                    isSelected
                                                        ? "bg-indigo-500 text-white"
                                                        : "bg-transparent",
                                                )}
                                            >
                                                {isSelected && (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </div>
                                            <span className="text-slate-200">
                                                {property}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                (
                                                {properties[property]?.size ||
                                                    0}
                                                )
                                            </span>
                                        </div>
                                        {hasFilters && (
                                            <span className="text-xs text-green-400">
                                                {activeFilters[property]?.size}{" "}
                                                filtered
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
