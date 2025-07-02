import { Check, Copy } from "lucide-react";

interface MessageSectionProps {
    message: string;
    onCopy: () => void;
    isCopied: boolean;
}

export default function MessageSection({ message, onCopy, isCopied }: MessageSectionProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                    Message
                </h3>
                <button
                    type="button"
                    onClick={onCopy}
                    className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-400 hover:text-white"
                    title="Copy message"
                >
                    {isCopied ? (
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
    );
} 