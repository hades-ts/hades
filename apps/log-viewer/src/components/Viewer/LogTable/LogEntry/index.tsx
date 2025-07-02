import { TableCell, TableRow } from "@/components/ui/table";
import { useFilterStore } from "../../../../store/filterStore";
import { useUiStore } from "../../../../store/uiStore";
import type { LogEntry as LogEntryType } from "../../../../types";
import LevelBadge from "./LevelBadge";
import MessageCell from "./MessageCell";
import TagsCell from "./TagsCell";
import TimestampCell from "./TimestampCell";

interface LogEntryProps {
    log: LogEntryType;
    index: number;
}

export default function LogEntry({ log }: LogEntryProps) {
    const { filterMode, isLogMatchingFilters, hasActiveFilters } =
        useFilterStore();
    const { selectedLogEntry, setSelectedLogEntry } = useUiStore();

    const isSelected = selectedLogEntry === log;
    const matchesFilters = isLogMatchingFilters(log);
    const hasFilters = hasActiveFilters();

    const handleClick = () => {
        if (isSelected) {
            setSelectedLogEntry(null); // Deselect if already selected
        } else {
            setSelectedLogEntry(log);
        }
    };

    // Determine row styling based on mode
    const getRowClassName = () => {
        const baseClasses = "cursor-pointer transition-colors border-slate-700";

        if (isSelected) {
            return `${baseClasses} bg-blue-900/30 hover:bg-blue-900/40 border-blue-700`;
        }

        if (filterMode === "tint" && hasFilters && matchesFilters) {
            // Brighten background for matching entries in tint mode, but only if filters are active
            return `${baseClasses} bg-slate-700/50 hover:bg-slate-700/70`;
        }

        return `${baseClasses} hover:bg-slate-800/50`;
    };

    return (
        <TableRow className={getRowClassName()} onClick={handleClick}>
            <TableCell className="font-medium">
                <LevelBadge level={log.level as string} />
            </TableCell>
            <TimestampCell timestamp={log.timestamp} />
            <TableCell className="text-slate-300">
                {log.name ? String(log.name) : "-"}
            </TableCell>
            <MessageCell message={log.message} />
            <TagsCell tags={log.tags} />
        </TableRow>
    );
}
