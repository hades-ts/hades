import { AlertTriangle, Tag, User } from "lucide-react";

import { useFilterStore } from "../../../../../store/filterStore";
import FilterButton from "../FilterButton";

const SPECIAL_PROPERTY_ICONS = {
    level: AlertTriangle,
    name: User,
    tags: Tag,
};

interface FilterGroupProps {
    property: string;
    values: string[];
    activeValues: Set<string>;
    onToggleFilter: (value: string) => void;
    onClearFilters: () => void;
}

export default function FilterGroup({
    property,
    values,
    activeValues,
    onToggleFilter,
    onClearFilters,
}: FilterGroupProps) {
    const Icon =
        SPECIAL_PROPERTY_ICONS[property as keyof typeof SPECIAL_PROPERTY_ICONS];

    const { specialExcludedFilters, toggleExcludedFilter } = useFilterStore();
    const excludedValues = specialExcludedFilters[property] || new Set<string>();

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300 capitalize">
                        {property}
                    </span>
                    <span className="text-xs text-slate-500">
                        ({values.length})
                    </span>
                </div>
                {(activeValues.size > 0 || excludedValues.size > 0) && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                    const isActive = activeValues.has(String(value));
                    const isExcluded = excludedValues.has(String(value));

                    return (
                        <FilterButton
                            key={String(value)}
                            value={String(value)}
                            isActive={isActive}
                            isExcluded={isExcluded}
                            isLevel={property === "level"}
                            onClick={() => {
                                // If excluded, remove from exclusions
                                if (isExcluded) {
                                    toggleExcludedFilter(property, String(value), true);
                                } else {
                                    // Toggle inclusion
                                    onToggleFilter(String(value));
                                }
                            }}
                            onContextMenu={() => {
                                // If included, remove from inclusions
                                if (isActive) {
                                    onToggleFilter(String(value));
                                }
                                // Toggle exclusion
                                toggleExcludedFilter(property, String(value), true);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
