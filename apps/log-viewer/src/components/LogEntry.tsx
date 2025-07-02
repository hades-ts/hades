import { TableCell, TableRow } from '@/components/ui/table';
import { useFilterStore } from '../store/filterStore';
import { useUiStore } from '../store/uiStore';
import { LogEntry as LogEntryType } from '../types';

interface LogEntryProps {
    log: LogEntryType;
    index: number;
}

const getLevelColor = (level: string | undefined) => {
    if (!level) return 'text-slate-400';

    switch (level.toLowerCase()) {
        case 'error':
            return 'text-red-400';
        case 'warn':
        case 'warning':
            return 'text-yellow-400';
        case 'info':
            return 'text-blue-400';
        case 'debug':
            return 'text-purple-400';
        case 'trace':
            return 'text-gray-400';
        case 'fatal':
            return 'text-red-600';
        default:
            return 'text-slate-300';
    }
};

const getLevelBadge = (level: string | undefined) => {
    if (!level) return null;

    const color = getLevelColor(level);
    const bgColor = level.toLowerCase() === 'error' ? 'bg-red-900/30' :
        level.toLowerCase() === 'warn' || level.toLowerCase() === 'warning' ? 'bg-yellow-900/30' :
            level.toLowerCase() === 'info' ? 'bg-blue-900/30' :
                level.toLowerCase() === 'debug' ? 'bg-purple-900/30' :
                    level.toLowerCase() === 'fatal' ? 'bg-red-900/50' :
                        'bg-slate-800/30';

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${color} ${bgColor} border border-current/20`}>
            {level.toUpperCase()}
        </span>
    );
};

const formatTimestamp = (timestamp: unknown) => {
    if (!timestamp) return '-';

    try {
        const date = new Date(String(timestamp));
        if (isNaN(date.getTime())) return String(timestamp);

        return date.toLocaleString();
    } catch {
        return String(timestamp);
    }
};

const formatTags = (tags: unknown) => {
    if (!tags) return '-';

    if (Array.isArray(tags)) {
        return tags.map(tag => String(tag)).join(', ');
    }

    if (typeof tags === 'object') {
        return JSON.stringify(tags);
    }

    return String(tags);
};

export default function LogEntry({ log, index }: LogEntryProps) {
    const { filterMode, isLogMatchingFilters, hasActiveFilters } = useFilterStore();
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
        let baseClasses = 'cursor-pointer transition-colors border-slate-700';

        if (isSelected) {
            return `${baseClasses} bg-blue-900/30 hover:bg-blue-900/40 border-blue-700`;
        }

        if (filterMode === 'tint' && hasFilters && matchesFilters) {
            // Brighten background for matching entries in tint mode, but only if filters are active
            return `${baseClasses} bg-slate-700/50 hover:bg-slate-700/70`;
        }

        return `${baseClasses} hover:bg-slate-800/50`;
    };

    return (
        <TableRow
            className={getRowClassName()}
            onClick={handleClick}
        >
            <TableCell className="font-medium">
                {getLevelBadge(log.level as string)}
            </TableCell>
            <TableCell className="text-slate-400 text-xs">
                {formatTimestamp(log.timestamp)}
            </TableCell>
            <TableCell className="text-slate-300">
                {log.name ? String(log.name) : '-'}
            </TableCell>
            <TableCell className="text-slate-200 max-w-md">
                <div className="truncate" title={log.message}>
                    {log.message || '-'}
                </div>
            </TableCell>
            <TableCell className="text-slate-400 text-xs">
                <div className="truncate max-w-32" title={formatTags(log.tags)}>
                    {formatTags(log.tags)}
                </div>
            </TableCell>
        </TableRow>
    );
} 