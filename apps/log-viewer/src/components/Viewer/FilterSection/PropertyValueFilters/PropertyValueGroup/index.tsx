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
                    {activeValues.size === 0 && (
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
                {values.map((value) => (
                    <ValueButton
                        key={String(value)}
                        value={String(value)}
                        isActive={activeValues.has(String(value))}
                        onClick={() => onToggleFilter(String(value))}
                    />
                ))}
            </div>

            {activeValues.size > 0 && (
                <div className="text-xs text-slate-500">
                    {activeValues.size} of {values.length} values selected
                </div>
            )}
        </div>
    );
} 