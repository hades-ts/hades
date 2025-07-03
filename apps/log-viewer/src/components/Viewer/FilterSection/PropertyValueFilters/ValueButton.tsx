interface ValueButtonProps {
    value: string;
    isActive: boolean;
    isExcluded?: boolean;
    onClick: () => void;
    onContextMenu?: () => void;
}

export default function ValueButton({
    value,
    isActive,
    isExcluded = false,
    onClick,
    onContextMenu,
}: ValueButtonProps) {
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onContextMenu) {
            onContextMenu();
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            onContextMenu={handleContextMenu}
            className={`px-2 py-1 text-xs rounded-md transition-all select-none ${isExcluded
                    ? 'bg-red-500 text-white ring-1 ring-red-400'
                    : isActive
                        ? 'bg-green-500 text-white ring-1 ring-green-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
            title={isExcluded ? "Right-click to include" : "Right-click to exclude"}
        >
            {value}
        </button>
    );
} 