import PropertyBadge from "../PropertyBadge";

interface SelectedPropertiesListProps {
    selectedPropertiesArray: string[];
    activeFilters: Record<string, Set<string>>;
    clearPropertyFilters: (property?: string) => void;
    togglePropertySelection: (property: string) => void;
}

export default function SelectedPropertiesList({
    selectedPropertiesArray,
    activeFilters,
    clearPropertyFilters,
    togglePropertySelection,
}: SelectedPropertiesListProps) {
    if (selectedPropertiesArray.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <span className="text-xs text-slate-400">
                Selected Properties:
            </span>
            <div className="flex flex-wrap gap-2">
                {selectedPropertiesArray.map((property) => (
                    <PropertyBadge
                        key={property}
                        property={property}
                        activeFilters={activeFilters}
                        onRemove={() => {
                            const hasFilters = activeFilters[property] && activeFilters[property].size > 0;
                            if (hasFilters) {
                                clearPropertyFilters(property);
                            } else {
                                togglePropertySelection(property);
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
} 