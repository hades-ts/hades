interface PropertyValueProps {
    value: unknown;
}

export default function PropertyValue({ value }: PropertyValueProps) {
    return (
        <div className="text-sm text-slate-200">
            {Array.isArray(value) ? (
                <div className="space-y-2">
                    {value.map((item, index) => (
                        <div
                            key={index}
                            className="bg-slate-700/70 rounded-md px-3 py-2 text-xs font-mono"
                        >
                            {String(item)}
                        </div>
                    ))}
                </div>
            ) : typeof value === "object" && value !== null ? (
                <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-700/70 p-3 rounded-md overflow-x-auto">
                    {JSON.stringify(value, null, 2)}
                </pre>
            ) : (
                <div className="font-mono text-xs bg-slate-700/70 p-3 rounded-md break-all">
                    {String(value)}
                </div>
            )}
        </div>
    );
} 