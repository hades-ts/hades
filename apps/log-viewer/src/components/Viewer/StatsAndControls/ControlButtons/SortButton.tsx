import { ArrowUpDown } from "lucide-react";

interface SortButtonProps {
    sortOrder: "newest" | "oldest";
    onToggle: () => void;
}

export default function SortButton({ sortOrder, onToggle }: SortButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
        >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
        </button>
    );
} 