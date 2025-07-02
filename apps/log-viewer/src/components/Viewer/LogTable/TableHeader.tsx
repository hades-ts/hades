import { TableHead, TableHeader as TableHeaderUI, TableRow } from "@/components/ui/table";

export default function TableHeader() {
    return (
        <TableHeaderUI>
            <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-300 font-semibold w-24">
                    Level
                </TableHead>
                <TableHead className="text-slate-300 font-semibold w-40">
                    Timestamp
                </TableHead>
                <TableHead className="text-slate-300 font-semibold w-32">
                    Name
                </TableHead>
                <TableHead className="text-slate-300 font-semibold">
                    Message
                </TableHead>
                <TableHead className="text-slate-300 font-semibold w-32">
                    Tags
                </TableHead>
            </TableRow>
        </TableHeaderUI>
    );
} 