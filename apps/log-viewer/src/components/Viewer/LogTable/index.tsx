import { Table, TableBody } from "@/components/ui/table";
import { useFileStore } from "../../../store/fileStore";
import { useFilterStore } from "../../../store/filterStore";
import EmptyState from "./EmptyState";
import LogEntry from "./LogEntry";
import TableHeader from "./TableHeader";

export default function LogTable() {
    const { logs } = useFileStore();
    const { filteredLogs } = useFilterStore();

    return (
        <div className="rounded-md border border-slate-700 bg-slate-900/50">
            {filteredLogs.length === 0 ? (
                <EmptyState hasLogs={logs.length > 0} />
            ) : (
                <Table>
                    <TableHeader />
                    <TableBody>
                        {filteredLogs.map((log, index) => (
                            <LogEntry key={index} log={log} index={index} />
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
