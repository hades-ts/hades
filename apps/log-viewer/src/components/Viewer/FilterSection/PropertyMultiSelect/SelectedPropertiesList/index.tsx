import { useFilterStore } from "../../../../../store/filterStore";
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
}: SelectedPropertiesListProps) {
    const { excludedProperties } = useFilterStore();
    const excludedPropertiesArray = Array.from(excludedProperties);

    // Combine selected and excluded properties
    const allProperties = [...new Set([...selectedPropertiesArray, ...excludedPropertiesArray])];

    if (allProperties.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <span className="text-xs text-slate-400">
                Active Property Filters:
            </span>
            <div className="flex flex-wrap gap-2">
                {allProperties.map((property) => (
                    <PropertyBadge
                        key={property}
                        property={property}
                        activeFilters={activeFilters}
                        onRemove={() => {
                            clearPropertyFilters(property);
                        }}
                    />
                ))}
            </div>
        </div>
    );
} 