import { useFilterStore } from "../../../store/filterStore";
import PropertyMultiSelect from "./PropertyMultiSelect";
import PropertyValueFilters from "./PropertyValueFilters";
import SearchBar from "./SearchBar";
import SpecialPropertyFilters from "./SpecialPropertyFilters";

export default function FilterSection() {
    const { messageFilter, setMessageFilter } = useFilterStore();

    return (
        <div className="mb-6 space-y-6">
            <SearchBar value={messageFilter} onChange={setMessageFilter} />
            <PropertyMultiSelect />
            <SpecialPropertyFilters />
            <PropertyValueFilters />
        </div>
    );
}
