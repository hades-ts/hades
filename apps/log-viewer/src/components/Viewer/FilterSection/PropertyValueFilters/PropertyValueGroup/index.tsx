import { useFilterStore } from "../../../../../store/filterStore";
import ValueButton from "../ValueButton";

interface PropertyValueGroupProps {
    property: string;
    values: string[];
    activeValues: Set<string>;
    onToggleFilter: (value: string) => void;
    onClearFilters: () => void;
}

export default function PropertyValueGroup({
    property,
    values,
    activeValues,
    onToggleFilter,
    onClearFilters,
}: PropertyValueGroupProps) {
    const { excludedFilters, toggleExcludedFilter } = useFilterStore();
    const excludedValues = excludedFilters[property] || new Set<string>();

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-300">
                        {property}
                    </span>
                    <span className="text-xs text-slate-500">
                        ({values.length} values)
                    </span>
                    {activeValues.size === 0 && excludedValues.size === 0 && (
                        <span className="text-xs text-blue-400">
                            Filtering by existence
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                    Remove Filter
                </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {values.map((value) => {
                    const isActive = activeValues.has(String(value));
                    const isExcluded = excludedValues.has(String(value));

                    return (
                        <ValueButton
                            key={String(value)}
                            value={String(value)}
                            isActive={isActive}
                            isExcluded={isExcluded}
                            onClick={() => {
                                // If excluded, remove from exclusions
                                if (isExcluded) {
                                    toggleExcludedFilter(property, String(value), false);
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
                                toggleExcludedFilter(property, String(value), false);
                            }}
                        />
                    );
                })}
            </div>

            {(activeValues.size > 0 || excludedValues.size > 0) && (
                <div className="text-xs text-slate-500">
                    {activeValues.size > 0 && (
                        <span>{activeValues.size} included</span>
                    )}
                    {activeValues.size > 0 && excludedValues.size > 0 && (
                        <span>, </span>
                    )}
                    {excludedValues.size > 0 && (
                        <span>{excludedValues.size} excluded</span>
                    )}
                </div>
            )}
        </div>
    );
} 