const getLevelColor = (level: string | undefined) => {
    if (!level) return "text-slate-400";

    switch (level.toLowerCase()) {
        case "error":
            return "text-red-400";
        case "warn":
        case "warning":
            return "text-yellow-400";
        case "info":
            return "text-blue-400";
        case "debug":
            return "text-purple-400";
        case "trace":
            return "text-gray-400";
        case "fatal":
            return "text-red-600";
        default:
            return "text-slate-300";
    }
};

const getLevelBadge = (level: string | undefined) => {
    if (!level) return null;

    const color = getLevelColor(level);
    const bgColor =
        level.toLowerCase() === "error"
            ? "bg-red-900/30"
            : level.toLowerCase() === "warn" ||
                level.toLowerCase() === "warning"
                ? "bg-yellow-900/30"
                : level.toLowerCase() === "info"
                    ? "bg-blue-900/30"
                    : level.toLowerCase() === "debug"
                        ? "bg-purple-900/30"
                        : level.toLowerCase() === "fatal"
                            ? "bg-red-900/50"
                            : "bg-slate-800/30";

    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${color} ${bgColor} border border-current/20`}
        >
            {level.toUpperCase()}
        </span>
    );
};

interface LevelBadgeProps {
    level: string | undefined;
}

export default function LevelBadge({ level }: LevelBadgeProps) {
    return getLevelBadge(level);
} 