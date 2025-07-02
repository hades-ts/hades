import { useState } from "react";

import { useFileStore } from "../../../../store/fileStore";
import { useFilterStore } from "../../../../store/filterStore";
import PropertySelector from "./PropertySelector";
import SelectedPropertiesList from "./SelectedPropertiesList";

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
                        type="button"
                        onClick={() => clearPropertyFilters()}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <PropertySelector
                open={open}
                onOpenChange={setOpen}
                selectedPropertiesArray={selectedPropertiesArray}
                availableProperties={availableProperties}
                properties={properties}
                selectedProperties={selectedProperties}
                activeFilters={activeFilters}
                togglePropertySelection={togglePropertySelection}
            />

            <SelectedPropertiesList
                selectedPropertiesArray={selectedPropertiesArray}
                activeFilters={activeFilters}
                clearPropertyFilters={clearPropertyFilters}
                togglePropertySelection={togglePropertySelection}
            />
        </div>
    );
}
