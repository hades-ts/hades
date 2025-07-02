import { useEffect, useRef, useState } from 'react';
import { useLogWatcher } from '../hooks/useLogWatcher';
import { useFileStore } from '../store/fileStore';
import { useFilterStore } from '../store/filterStore';
import { useUiStore } from '../store/uiStore';
import ControlButtons from './ControlButtons';
import FilterSection from './FilterSection';
import Header from './Header';
import { LogDetailSidebar } from './LogDetailSidebar';
import LogStats from './LogStats';
import LogTable from './LogTable';

// Pulse effect configuration
const PULSE_BRIGHTNESS = 1.1; // 1.0 = normal, 1.1 = 10% brighter, 1.2 = 20% brighter, etc.
const PULSE_DURATION_MS = 180; // Duration in milliseconds

export default function LogViewer() {
    // File store
    const {
        file,
        isWatching,
        logs,
        setFile,
        setIsWatching,
        addLogs,
        clearLogs,
    } = useFileStore();

    // Filter store
    const { resetFilters, updateFilteredLogs } = useFilterStore();

    // UI store
    const { selectedLogEntry } = useUiStore();

    const [isPulsing, setIsPulsing] = useState(false);
    const previousLogsLength = useRef(logs.length);

    const { startWatching, stopWatching, cleanup } = useLogWatcher({
        file,
        isWatching,
        onNewLogs: (newLogs) => {
            addLogs(newLogs);
            // Trigger filter update after adding logs
            setTimeout(() => updateFilteredLogs(), 0);
        },
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
        <div className="min-h-screen relative">
            {/* Fixed background */}
            <div
                className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10"
                style={{
                    '--pulse-brightness': PULSE_BRIGHTNESS,
                    animation: isPulsing ? `brightness-pulse ${PULSE_DURATION_MS}ms ease-in-out` : 'none',
                } as React.CSSProperties}
            />

            {/* Content */}
            <div className="text-white relative">
                <Header
                    file={file}
                    isWatching={isWatching}
                    onSelectFile={selectFile}
                    onToggleWatching={handleToggleWatching}
                />

                <div className="max-w-7xl mx-auto px-6 py-6">
                    {/* Filters Section */}
                    <FilterSection />

                    {/* Stats and Controls */}
                    <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
                        <LogStats />
                        <ControlButtons />
                    </div>

                    {/* Log Entries Table */}
                    <LogTable />
                </div>

                {/* Sidebar as overlay */}
                {selectedLogEntry && <LogDetailSidebar />}
            </div>
        </div>
    );
} 