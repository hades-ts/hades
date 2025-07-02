import { useFilterStore } from "../../../../store/filterStore";
import FilterModeButton from "./FilterModeButton";
import ResetButton from "./ResetButton";
import SortButton from "./SortButton";

export default function ControlButtons() {
    const {
        sortOrder,
        filterMode,
        resetFilters,
        toggleSortOrder,
        toggleFilterMode,
    } = useFilterStore();

    return (
        <div className="flex items-center gap-3">
            <ResetButton onReset={resetFilters} />
            <SortButton sortOrder={sortOrder} onToggle={toggleSortOrder} />
            <FilterModeButton
                filterMode={filterMode}
                onToggle={toggleFilterMode}
            />
        </div>
    );
}
