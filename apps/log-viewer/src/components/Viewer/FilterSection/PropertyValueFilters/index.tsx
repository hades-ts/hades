import { useFileStore } from "../../../../store/fileStore";
import { useFilterStore } from "../../../../store/filterStore";
import PropertyValueGroup from "./PropertyValueGroup";

export default function PropertyValueFilters() {
    const { properties } = useFileStore();
    const {
        activeFilters,
        selectedProperties,
        togglePropertyFilter,
        clearPropertyFilters,
    } = useFilterStore();

    const selectedPropertiesWithValues = Array.from(selectedProperties).filter(
        property => properties[property] && properties[property].size > 0
    );

    if (selectedPropertiesWithValues.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Property Value Filters</h3>

            {selectedPropertiesWithValues.map((property) => (
                <PropertyValueGroup
                    key={property}
                    property={property}
                    values={Array.from(properties[property] || []).sort()}
                    activeValues={activeFilters[property] || new Set()}
                    onToggleFilter={(value) => togglePropertyFilter(property, value, false)}
                    onClearFilters={() => clearPropertyFilters(property)}
                />
            ))}
        </div>
    );
} 