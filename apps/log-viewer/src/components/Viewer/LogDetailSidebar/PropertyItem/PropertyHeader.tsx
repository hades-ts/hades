import { Check, Copy } from "lucide-react";

interface PropertyHeaderProps {
    propertyKey: string;
    value: unknown;
    onCopy: () => void;
    isCopied: boolean;
}

export default function PropertyHeader({
    propertyKey,
    value,
    onCopy,
    isCopied,
}: PropertyHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    {propertyKey}
                </span>
                <span className="text-xs text-slate-500">
                    {Array.isArray(value) ? "Array" : typeof value}
                </span>
            </div>
            <button
                type="button"
                onClick={onCopy}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-400 hover:text-white"
                title={`Copy ${propertyKey}`}
            >
                {isCopied ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </button>
        </div>
    );
} 