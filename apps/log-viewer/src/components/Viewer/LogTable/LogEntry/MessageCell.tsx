import { TableCell } from "@/components/ui/table";

interface MessageCellProps {
    message: string | undefined;
}

export default function MessageCell({ message }: MessageCellProps) {
    return (
        <TableCell className="text-slate-200 max-w-md">
            <div className="truncate" title={message}>
                {message || "-"}
            </div>
        </TableCell>
    );
} 