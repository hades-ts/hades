import { useFilterStore } from '../../store/filterStore';
import PropertyMultiSelect from '../PropertyMultiSelect';
import PropertyValueFilters from '../PropertyValueFilters';
import SearchBar from '../SearchBar';
import SpecialPropertyFilters from '../SpecialPropertyFilters';

export default function FilterSection() {
    const { messageFilter, setMessageFilter } = useFilterStore();

    return (
        <div className="mb-6 space-y-6">
            {/* 1. Message Search */}
            <SearchBar
                value={messageFilter}
                onChange={setMessageFilter}
            />

            {/* 2. Property Selection Dropdown */}
            <PropertyMultiSelect />

            {/* 3. Permanent Value Filters (Special Properties) */}
            <SpecialPropertyFilters />

            {/* 4. Enabled Value Filters (Selected Properties) */}
            <PropertyValueFilters />
        </div>
    );
} 