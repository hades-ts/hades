import type { LogEntry } from "../../../../types";
import PropertyItem from "../PropertyItem";

interface PropertiesSectionProps {
    properties: Omit<LogEntry, "message">;
    onCopy: (key: string, value: unknown) => void;
    copiedField: string | null;
}

export default function PropertiesSection({
    properties,
    onCopy,
    copiedField,
}: PropertiesSectionProps) {
    return (
        <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">
                Properties
            </h3>
            <div className="space-y-3">
                {Object.entries(properties).map(([key, value]) => (
                    <PropertyItem
                        key={key}
                        propertyKey={key}
                        value={value}
                        onCopy={() => onCopy(key, value)}
                        isCopied={copiedField === key}
                    />
                ))}
            </div>
        </div>
    );
}
