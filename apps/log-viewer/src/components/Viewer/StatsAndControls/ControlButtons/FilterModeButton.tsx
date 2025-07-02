import { Filter, Palette } from "lucide-react";

interface FilterModeButtonProps {
    filterMode: "filter" | "tint";
    onToggle: () => void;
}

export default function FilterModeButton({ filterMode, onToggle }: FilterModeButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
        >
            {filterMode === "filter" ? (
                <Filter className="w-4 h-4" />
            ) : (
                <Palette className="w-4 h-4" />
            )}
            {filterMode === "filter" ? "Filter" : "Tint"}
        </button>
    );
} 