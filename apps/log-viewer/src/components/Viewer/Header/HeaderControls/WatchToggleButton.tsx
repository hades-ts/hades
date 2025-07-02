import { Pause, Play } from "lucide-react";

interface WatchToggleButtonProps {
    isWatching: boolean;
    onToggleWatching: () => void;
}

export default function WatchToggleButton({
    isWatching,
    onToggleWatching,
}: WatchToggleButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggleWatching}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isWatching
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
        >
            {isWatching ? (
                <Pause className="w-4 h-4" />
            ) : (
                <Play className="w-4 h-4" />
            )}
            {isWatching ? "Stop" : "Start"}
        </button>
    );
} 