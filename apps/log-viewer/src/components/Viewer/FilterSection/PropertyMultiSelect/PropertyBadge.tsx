import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface PropertyBadgeProps {
    property: string;
    activeFilters: Record<string, Set<string>>;
    onRemove: () => void;
}

export default function PropertyBadge({
    property,
    activeFilters,
    onRemove,
}: PropertyBadgeProps) {
    const hasFilters =
        activeFilters[property] && activeFilters[property].size > 0;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full",
                hasFilters
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white",
            )}
        >
            <span>{property}</span>
            {hasFilters && (
                <span className="opacity-75">
                    ({activeFilters[property]?.size})
                </span>
            )}
            <button
                type="button"
                onClick={onRemove}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    );
}
