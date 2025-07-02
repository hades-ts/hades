import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useState } from 'react';
import { useFileStore } from '../store/fileStore';
import { useFilterStore } from '../store/filterStore';

export default function PropertyMultiSelect() {
    const [open, setOpen] = useState(false);
    const { properties } = useFileStore();
    const {
        activeFilters,
        selectedProperties,
        togglePropertySelection,
        clearPropertyFilters,
    } = useFilterStore();

    const availableProperties = Object.keys(properties).sort();
    const selectedPropertiesArray = Array.from(selectedProperties);

    const hasActiveFilters = (property: string) => {
        return activeFilters[property] && activeFilters[property].size > 0;
    };

    if (availableProperties.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                    Property Filters
                </span>
                {selectedPropertiesArray.length > 0 && (
                    <button
                        onClick={() => clearPropertyFilters()}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
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
                                    const isSelected = selectedProperties.has(property);
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
                                                <div className={cn(
                                                    "flex h-4 w-4 items-center justify-center rounded-sm border border-slate-600",
                                                    isSelected ? "bg-indigo-500 text-white" : "bg-transparent"
                                                )}>
                                                    {isSelected && <Check className="h-3 w-3" />}
                                                </div>
                                                <span className="text-slate-200">{property}</span>
                                                <span className="text-xs text-slate-500">
                                                    ({properties[property]?.size || 0})
                                                </span>
                                            </div>
                                            {hasFilters && (
                                                <span className="text-xs text-green-400">
                                                    {activeFilters[property]?.size} filtered
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

            {/* Selected Properties Summary */}
            {selectedPropertiesArray.length > 0 && (
                <div className="space-y-2">
                    <span className="text-xs text-slate-400">Selected Properties:</span>
                    <div className="flex flex-wrap gap-2">
                        {selectedPropertiesArray.map((property) => {
                            const hasFilters = hasActiveFilters(property);

                            return (
                                <div
                                    key={property}
                                    className={cn(
                                        "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full",
                                        hasFilters
                                            ? "bg-green-600 text-white"
                                            : "bg-blue-600 text-white"
                                    )}
                                >
                                    <span>{property}</span>
                                    {hasFilters && (
                                        <span className="opacity-75">
                                            ({activeFilters[property]?.size})
                                        </span>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (hasFilters) {
                                                clearPropertyFilters(property);
                                            } else {
                                                togglePropertySelection(property);
                                            }
                                        }}
                                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
} 