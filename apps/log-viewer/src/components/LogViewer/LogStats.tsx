import { useFileStore } from '../../store/fileStore';
import { useFilterStore } from '../../store/filterStore';

export default function LogStats() {
    const { file, isWatching, logs } = useFileStore();
    const { filteredLogs } = useFilterStore();

    return (
        <div className="flex items-center gap-6">
            <span>Total: {logs.length} entries</span>
            <span>Filtered: {filteredLogs.length} entries</span>
            {file && (
                <span className={`flex items-center gap-1 ${isWatching ? 'text-green-400' : 'text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${isWatching ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                    {isWatching ? 'Watching' : 'Stopped'}
                </span>
            )}
        </div>
    );
} 