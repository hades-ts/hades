import { useFileStore } from "../../../../store/fileStore";
import { useFilterStore } from "../../../../store/filterStore";
import FilterGroup from "./FilterGroup";

export default function SpecialPropertyFilters() {
    const { specialProperties } = useFileStore();
    const { specialActiveFilters, togglePropertyFilter, clearPropertyFilters } =
        useFilterStore();

    const specialPropertyKeys = ["level", "name", "tags"];
    const availableSpecialProperties = specialPropertyKeys.filter(
        (prop) => specialProperties[prop] && specialProperties[prop].size > 0,
    );

    if (availableSpecialProperties.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">
                Quick Filters
            </h3>

            {availableSpecialProperties.map((property) => (
                <FilterGroup
                    key={property}
                    property={property}
                    values={Array.from(specialProperties[property] || []).sort()}
                    activeValues={specialActiveFilters[property] || new Set()}
                    onToggleFilter={(value) => togglePropertyFilter(property, value, true)}
                    onClearFilters={() => clearPropertyFilters(property)}
                />
            ))}
        </div>
    );
} 