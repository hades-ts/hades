import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, FileText, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLogWatcher } from '../hooks/useLogWatcher';
import { useLogStore } from '../store/logStore';
import Header from './Header';
import { LogDetailSidebar } from './LogDetailSidebar';
import LogEntryComponent from './LogEntry';
import PropertyMultiSelect from './PropertyMultiSelect';
import PropertyValueFilters from './PropertyValueFilters';
import SearchBar from './SearchBar';
import SpecialPropertyFilters from './SpecialPropertyFilters';

// Pulse effect configuration
const PULSE_BRIGHTNESS = 1.1; // 1.0 = normal, 1.1 = 10% brighter, 1.2 = 20% brighter, etc.
const PULSE_DURATION_MS = 180; // Duration in milliseconds

export default function LogViewer() {
    const {
        file,
        isWatching,
        logs,
        filteredLogs,
        messageFilter,
        sortOrder,
        selectedLogEntry,
        setFile,
        setIsWatching,
        addLogs,
        clearLogs,
        setMessageFilter,
        toggleSortOrder,
        resetFilters,
    } = useLogStore();

    const [isPulsing, setIsPulsing] = useState(false);
    const previousLogsLength = useRef(logs.length);

    const { startWatching, stopWatching, cleanup } = useLogWatcher({
        file,
        isWatching,
        onNewLogs: addLogs,
        onClearLogs: clearLogs,
    });

    // Trigger pulse effect when new logs are added (not from filter changes)
    useEffect(() => {
        if (logs.length > previousLogsLength.current && previousLogsLength.current > 0) {
            setIsPulsing(true);
            const timer = setTimeout(() => setIsPulsing(false), PULSE_DURATION_MS);
            return () => clearTimeout(timer);
        }
        previousLogsLength.current = logs.length;
    }, [logs.length]);

    const selectFile = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Log files',
                    accept: { 'text/plain': ['.log', '.txt', '.json'] }
                }]
            });
            const selectedFile = await fileHandle.getFile();
            setFile({ handle: fileHandle, file: selectedFile });
            clearLogs();
            resetFilters();
            setIsWatching(true);
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

    // Auto-start watching when file is selected and isWatching is true
    useEffect(() => {
        if (file && isWatching) {
            startWatching();
        }
    }, [file, isWatching]);

    // Cleanup on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative"
            style={{
                '--pulse-brightness': PULSE_BRIGHTNESS,
                animation: isPulsing ? `brightness-pulse ${PULSE_DURATION_MS}ms ease-in-out` : 'none',
            } as React.CSSProperties}
        >
            <Header
                file={file}
                isWatching={isWatching}
                onSelectFile={selectFile}
                onToggleWatching={handleToggleWatching}
            />

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Filters Section */}
                <div className="mb-6 space-y-6">
                    {/* 1. Message Search */}
                    <SearchBar
                        value={messageFilter}
                        onChange={setMessageFilter}
                    />

                    {/* 2. Property Selection Dropdown */}
                    <PropertyMultiSelect />

                    {/* 3. Permanent Value Filters (Special Properties) */}
                    <SpecialPropertyFilters />

                    {/* 4. Enabled Value Filters (Selected Properties) */}
                    <PropertyValueFilters />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
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

                    <div className="flex items-center gap-3">
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset Filters
                        </button>

                        <button
                            onClick={toggleSortOrder}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                        </button>
                    </div>
                </div>

                {/* Log Entries Table */}
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
            </div>

            {/* Sidebar as overlay */}
            {selectedLogEntry && <LogDetailSidebar />}
        </div>
    );
} 