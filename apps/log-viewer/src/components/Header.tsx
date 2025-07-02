import { FileText, Pause, Play } from 'lucide-react';
import { LogFile } from '../types';

interface HeaderProps {
    file: LogFile | null;
    isWatching: boolean;
    onSelectFile: () => void;
    onToggleWatching: () => void;
}

export default function Header({ file, isWatching, onSelectFile, onToggleWatching }: HeaderProps) {
    return (
        <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                JSON Log Viewer
                            </h1>
                            <p className="text-sm text-slate-400">
                                {file ? file.file.name : 'No file selected'}
                                {isWatching && <span className="ml-2 text-green-400">• Live</span>}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onSelectFile}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium"
                        >
                            Select File
                        </button>

                        {file && (
                            <button
                                onClick={onToggleWatching}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isWatching
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                    }`}
                            >
                                {isWatching ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                {isWatching ? 'Stop' : 'Start'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 