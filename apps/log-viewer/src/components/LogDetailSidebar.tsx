import { Check, Copy, X } from 'lucide-react';
import { useState } from 'react';
import { useLogStore } from '../store/logStore';

export function LogDetailSidebar() {
    const { selectedLogEntry, setSelectedLogEntry } = useLogStore();
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!selectedLogEntry) {
        return null;
    }

    const handleClose = () => {
        setSelectedLogEntry(null);
    };

    const handleCopy = async (key: string, value: unknown) => {
        try {
            let textToCopy: string;

            if (Array.isArray(value)) {
                textToCopy = value.map(item => String(item)).join('\n');
            } else if (typeof value === 'object' && value !== null) {
                textToCopy = JSON.stringify(value, null, 2);
            } else {
                textToCopy = String(value);
            }

            await navigator.clipboard.writeText(textToCopy);
            setCopiedField(key);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Separate message from other properties
    const { message, ...otherProperties } = selectedLogEntry;

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
                <h2 className="text-lg font-semibold text-white">Log Details</h2>
                <button
                    onClick={handleClose}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                {/* Message Section */}
                {message && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                                Message
                            </h3>
                            <button
                                onClick={() => handleCopy('message', message)}
                                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-400 hover:text-white"
                                title="Copy message"
                            >
                                {copiedField === 'message' ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                            <pre className="whitespace-pre-wrap text-slate-200 font-mono text-sm leading-relaxed">
                                {message}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Properties Section */}
                <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">
                        Properties
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(otherProperties).map(([key, value]) => (
                            <div key={key} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                                            {key}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {Array.isArray(value) ? 'Array' : typeof value}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(key, value)}
                                        className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-400 hover:text-white"
                                        title={`Copy ${key}`}
                                    >
                                        {copiedField === key ? (
                                            <Check className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="text-sm text-slate-200">
                                    {Array.isArray(value) ? (
                                        <div className="space-y-2">
                                            {value.map((item, index) => (
                                                <div key={index} className="bg-slate-700/70 rounded-md px-3 py-2 text-xs font-mono">
                                                    {String(item)}
                                                </div>
                                            ))}
                                        </div>
                                    ) : typeof value === 'object' && value !== null ? (
                                        <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-700/70 p-3 rounded-md overflow-x-auto">
                                            {JSON.stringify(value, null, 2)}
                                        </pre>
                                    ) : (
                                        <div className="font-mono text-xs bg-slate-700/70 p-3 rounded-md break-all">
                                            {String(value)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 