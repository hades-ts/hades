import { RotateCcw } from "lucide-react";

interface ResetButtonProps {
    onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
    return (
        <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
        >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
        </button>
    );
} 