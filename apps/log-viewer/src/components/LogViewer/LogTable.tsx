import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import { useFilterStore } from '../../store/filterStore';
import LogEntryComponent from '../LogEntry';

export default function LogTable() {
    const { logs } = useFileStore();
    const { filteredLogs } = useFilterStore();

    return (
        <div className="rounded-md border border-slate-700 bg-slate-900/50">
            {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    {logs.length === 0 ? (
                        <div>
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Select a log file to start</p>
                        </div>
                    ) : (
                        <p>No entries match the current filters</p>
                    )}
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-transparent">
                            <TableHead className="text-slate-300 font-semibold w-24">Level</TableHead>
                            <TableHead className="text-slate-300 font-semibold w-40">Timestamp</TableHead>
                            <TableHead className="text-slate-300 font-semibold w-32">Name</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Message</TableHead>
                            <TableHead className="text-slate-300 font-semibold w-32">Tags</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.map((log, index) => (
                            <LogEntryComponent key={index} log={log} index={index} />
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
} 