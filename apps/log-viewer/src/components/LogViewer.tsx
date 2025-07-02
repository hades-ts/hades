import { FileText } from 'lucide-react';
import { useEffect } from 'react';
import { useLogWatcher } from '../hooks/useLogWatcher';
import { useLogStore } from '../store/logStore';
import Header from './Header';
import LogEntryComponent from './LogEntry';
import PropertyFilters from './PropertyFilters';
import SearchBar from './SearchBar';

export default function LogViewer() {
    const {
        file,
        isWatching,
        logs,
        filteredLogs,
        messageFilter,
        setFile,
        setIsWatching,
        addLogs,
        clearLogs,
        setMessageFilter,
        resetFilters,
    } = useLogStore();

    const { startWatching, stopWatching, cleanup } = useLogWatcher({
        file,
        isWatching,
        onNewLogs: addLogs,
    });

    const selectFile = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Log files',
                    accept: { 'text/plain': ['.log', '.txt'] }
                }]
            });
            const selectedFile = await fileHandle.getFile();
            setFile({ handle: fileHandle, file: selectedFile });
            clearLogs();
            resetFilters();
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error('Error selecting file:', err);
            }
        }
    };

    const handleToggleWatching = async () => {
        if (isWatching) {
            stopWatching();
            setIsWatching(false);
        } else {
            setIsWatching(true);
            await startWatching();
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <Header
                file={file}
                isWatching={isWatching}
                onSelectFile={selectFile}
                onToggleWatching={handleToggleWatching}
            />

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Filters Section */}
                <div className="mb-6 space-y-4">
                    <SearchBar
                        value={messageFilter}
                        onChange={setMessageFilter}
                    />

                    <PropertyFilters />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6 text-sm text-slate-400">
                    <span>Total: {logs.length} entries</span>
                    <span>Filtered: {filteredLogs.length} entries</span>
                    {file && (
                        <span className={`flex items-center gap-1 ${isWatching ? 'text-green-400' : 'text-slate-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${isWatching ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                            {isWatching ? 'Watching' : 'Stopped'}
                        </span>
                    )}
                </div>

                {/* Log Entries */}
                <div className="space-y-2">
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
                        filteredLogs.map((log, index) => (
                            <LogEntryComponent key={index} log={log} index={index} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
} 