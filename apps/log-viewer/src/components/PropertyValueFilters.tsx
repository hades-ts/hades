import { X } from 'lucide-react';
import { useLogStore } from '../store/logStore';

export default function PropertyValueFilters() {
    const {
        properties,
        activeFilters,
        selectedProperties,
        togglePropertyFilter,
        clearPropertyFilters,
    } = useLogStore();

    const selectedPropertiesWithValues = Array.from(selectedProperties).filter(
        property => properties[property] && properties[property].size > 0
    );

    if (selectedPropertiesWithValues.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Property Value Filters</h3>

            {selectedPropertiesWithValues.map((property) => {
                const values = Array.from(properties[property] || []).sort();
                const activeValues = activeFilters[property] || new Set();

                return (
                    <div key={property} className="space-y-2">
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
                                onClick={() => clearPropertyFilters(property)}
                                className="text-xs text-slate-400 hover:text-white transition-colors"
                            >
                                Remove Filter
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {values.map((value) => {
                                const isActive = activeValues.has(String(value));
                                return (
                                    <button
                                        key={String(value)}
                                        onClick={() => togglePropertyFilter(property, String(value), false)}
                                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all ${isActive
                                                ? 'bg-green-500 text-white ring-1 ring-green-400'
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                                            }`}
                                    >
                                        {String(value)}
                                        {isActive && (
                                            <X
                                                className="w-3 h-3 ml-1 hover:bg-white/20 rounded-full cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePropertyFilter(property, String(value), false);
                                                }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {activeValues.size > 0 && (
                            <div className="text-xs text-slate-500">
                                {activeValues.size} of {values.length} values selected
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
} 