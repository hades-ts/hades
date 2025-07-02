interface ValueButtonProps {
    value: string;
    isActive: boolean;
    onClick: () => void;
}

export default function ValueButton({
    value,
    isActive,
    onClick,
}: ValueButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-2 py-1 text-xs rounded-md transition-all ${isActive
                    ? 'bg-green-500 text-white ring-1 ring-green-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
        >
            {value}
        </button>
    );
} 