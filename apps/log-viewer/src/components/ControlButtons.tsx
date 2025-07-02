import { ArrowUpDown, Filter, Palette, RotateCcw } from 'lucide-react';
import { useFilterStore } from '../store/filterStore';

export default function ControlButtons() {
    const { sortOrder, filterMode, resetFilters, toggleSortOrder, toggleFilterMode } = useFilterStore();

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
            >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
            </button>

            <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
            >
                <ArrowUpDown className="w-4 h-4" />
                {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>

            <button
                onClick={toggleFilterMode}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
            >
                {filterMode === 'filter' ? <Filter className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
                {filterMode === 'filter' ? 'Filter' : 'Tint'}
            </button>
        </div>
    );
} 