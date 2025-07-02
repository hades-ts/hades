import { Filter, X } from 'lucide-react';
import { useLogStore } from '../store/logStore';

export default function PropertyFilters() {
    const {
        properties,
        activeFilters,
        selectedProperty,
        setSelectedProperty,
        togglePropertyFilter,
        clearPropertyFilters,
    } = useLogStore();

    const getActiveFilterCount = () => {
        return Object.values(activeFilters).reduce((count, values) => count + values.size, 0);
    };

    // Sort properties alphabetically
    const sortedProperties = Object.keys(properties).sort();

    // Get sorted values for selected property
    const selectedPropertyValues = selectedProperty && properties[selectedProperty]
        ? Array.from(properties[selectedProperty]).sort()
        : [];

    const hasActiveFiltersForProperty = (property: string) => {
        return activeFilters[property] && activeFilters[property].size > 0;
    };

    if (sortedProperties.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Property Selection Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">Property Filters</span>
                    {getActiveFilterCount() > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-indigo-500 text-xs rounded-full">
                                {getActiveFilterCount()} active
                            </span>
                            <button
                                onClick={() => clearPropertyFilters()}
                                className="p-1 text-slate-400 hover:text-white transition-colors"
                                title="Clear all filters"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {sortedProperties.map((property) => (
                        <button
                            key={property}
                            onClick={() => setSelectedProperty(selectedProperty === property ? null : property)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedProperty === property
                                    ? 'bg-indigo-500 text-white ring-2 ring-indigo-400/50'
                                    : hasActiveFiltersForProperty(property)
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                                }`}
                        >
                            {property}
                            <span className="text-xs opacity-70">
                                ({properties[property]?.size || 0})
                            </span>
                            {hasActiveFiltersForProperty(property) && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white/20 text-xs rounded">
                                    {activeFilters[property]?.size}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Value Filters Section */}
            {selectedProperty && selectedPropertyValues.length > 0 && (
                <div className="space-y-3 border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-300">
                                Values for "{selectedProperty}"
                            </span>
                            <span className="text-xs text-slate-500">
                                ({selectedPropertyValues.length} unique)
                            </span>
                        </div>
                        {hasActiveFiltersForProperty(selectedProperty) && (
                            <button
                                onClick={() => clearPropertyFilters(selectedProperty)}
                                className="text-xs text-slate-400 hover:text-white transition-colors"
                            >
                                Clear {selectedProperty} filters
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                        {selectedPropertyValues.map((value) => {
                            const isActive = activeFilters[selectedProperty]?.has(String(value)) || false;
                            return (
                                <button
                                    key={String(value)}
                                    onClick={() => togglePropertyFilter(selectedProperty, String(value))}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-all ${isActive
                                            ? 'bg-indigo-500 text-white ring-2 ring-indigo-400/50'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                                        }`}
                                >
                                    {String(value)}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Active Filters Summary */}
            {getActiveFilterCount() > 0 && (
                <div className="space-y-2 border-t border-slate-700 pt-4">
                    <span className="text-sm font-medium text-slate-300">Active Filters:</span>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(activeFilters).map(([property, values]) => (
                            <div key={property} className="flex flex-wrap gap-1">
                                {Array.from(values).map((value) => (
                                    <div
                                        key={`${property}-${value}`}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded-full"
                                    >
                                        <span className="opacity-75">{property}:</span>
                                        <span>{String(value)}</span>
                                        <button
                                            onClick={() => togglePropertyFilter(property, String(value))}
                                            className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 