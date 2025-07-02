import PropertyHeader from "./PropertyHeader";
import PropertyValue from "./PropertyValue";

interface PropertyItemProps {
    propertyKey: string;
    value: unknown;
    onCopy: () => void;
    isCopied: boolean;
}

export default function PropertyItem({
    propertyKey,
    value,
    onCopy,
    isCopied,
}: PropertyItemProps) {
    return (
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <PropertyHeader
                propertyKey={propertyKey}
                value={value}
                onCopy={onCopy}
                isCopied={isCopied}
            />
            <PropertyValue value={value} />
        </div>
    );
} 