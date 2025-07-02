import { LogEntry as LogEntryType } from '../types';

interface LogEntryProps {
    log: LogEntryType;
    index: number;
}

export default function LogEntry({ log, index }: LogEntryProps) {
    return (
        <div
            key={index}
            className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600/50 transition-colors"
        >
            {log.message && (
                <div className="text-white mb-2 font-medium">{log.message}</div>
            )}
            <div className="text-xs text-slate-400 font-mono">
                {JSON.stringify(log, null, 2)}
            </div>
        </div>
    );
} 