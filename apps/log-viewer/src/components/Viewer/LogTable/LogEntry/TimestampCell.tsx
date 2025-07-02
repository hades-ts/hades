import { TableCell } from "@/components/ui/table";

const formatTimestamp = (timestamp: unknown) => {
    if (!timestamp) return "-";

    try {
        const date = new Date(String(timestamp));
        if (isNaN(date.getTime())) return String(timestamp);

        return date.toLocaleString();
    } catch {
        return String(timestamp);
    }
};

interface TimestampCellProps {
    timestamp: unknown;
}

export default function TimestampCell({ timestamp }: TimestampCellProps) {
    return (
        <TableCell className="text-slate-400 text-xs">
            {formatTimestamp(timestamp)}
        </TableCell>
    );
} 