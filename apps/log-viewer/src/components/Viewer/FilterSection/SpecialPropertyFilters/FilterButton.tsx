const getLevelColors = (level: string) => {
    switch (level.toLowerCase()) {
        case "error":
            return {
                text: "text-red-400",
                bg: "bg-red-900/30",
                border: "border-red-400/20",
                hoverBg: "hover:bg-red-900/40",
            };
        case "warn":
        case "warning":
            return {
                text: "text-yellow-400",
                bg: "bg-yellow-900/30",
                border: "border-yellow-400/20",
                hoverBg: "hover:bg-yellow-900/40",
            };
        case "info":
            return {
                text: "text-blue-400",
                bg: "bg-blue-900/30",
                border: "border-blue-400/20",
                hoverBg: "hover:bg-blue-900/40",
            };
        case "debug":
            return {
                text: "text-purple-400",
                bg: "bg-purple-900/30",
                border: "border-purple-400/20",
                hoverBg: "hover:bg-purple-900/40",
            };
        case "trace":
            return {
                text: "text-gray-400",
                bg: "bg-gray-900/30",
                border: "border-gray-400/20",
                hoverBg: "hover:bg-gray-900/40",
            };
        case "fatal":
            return {
                text: "text-red-600",
                bg: "bg-red-900/50",
                border: "border-red-600/30",
                hoverBg: "hover:bg-red-900/60",
            };
        default:
            return {
                text: "text-slate-300",
                bg: "bg-slate-800/30",
                border: "border-slate-700",
                hoverBg: "hover:bg-slate-700/50",
            };
    }
};

interface FilterButtonProps {
    value: string;
    isActive: boolean;
    isLevel: boolean;
    onClick: () => void;
}

export default function FilterButton({
    value,
    isActive,
    isLevel,
    onClick,
}: FilterButtonProps) {
    const levelColors = isLevel ? getLevelColors(value) : null;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${isActive
                    ? isLevel
                        ? `text-white ${levelColors?.bg} border ${levelColors?.border} ring-1 ring-current/30`
                        : "bg-indigo-500 text-white ring-1 ring-indigo-400"
                    : isLevel
                        ? `${levelColors?.text} ${levelColors?.bg} border ${levelColors?.border} ${levelColors?.hoverBg} hover:text-white`
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                }`}
        >
            {isLevel ? value.toUpperCase() : value}
        </button>
    );
} 