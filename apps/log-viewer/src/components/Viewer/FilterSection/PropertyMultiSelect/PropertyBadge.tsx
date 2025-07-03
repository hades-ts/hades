import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFilterStore } from "../../../../store/filterStore";

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
    const {
        isPropertyExcluded,
        selectedProperties,
        togglePropertySelection,
        togglePropertyExclusion,
        excludedFilters
    } = useFilterStore();

    const hasFilters = activeFilters[property] && activeFilters[property].size > 0;
    const hasExcludedFilters = excludedFilters[property] && excludedFilters[property].size > 0;
    const isExcluded = isPropertyExcluded(property);
    const isSelected = selectedProperties.has(property);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isExcluded) {
            // If currently excluded, toggle it back to selected
            togglePropertyExclusion(property);
            if (!isSelected) {
                togglePropertySelection(property);
            }
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isExcluded) {
            // If currently included, toggle to excluded
            if (isSelected) {
                togglePropertySelection(property);
            }
            togglePropertyExclusion(property);
        }
    };

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full cursor-pointer select-none",
                isExcluded
                    ? "bg-red-600 text-white"
                    : hasExcludedFilters
                        ? "bg-orange-600 text-white"
                        : hasFilters
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 text-white",
            )}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            title={isExcluded ? "Right-click to include" : "Right-click to exclude"}
        >
            <span>{property}</span>
            {hasFilters && (
                <span className="opacity-75">
                    ({activeFilters[property]?.size})
                </span>
            )}
            {hasExcludedFilters && (
                <span className="opacity-75">
                    (-{excludedFilters[property]?.size})
                </span>
            )}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    );
}
