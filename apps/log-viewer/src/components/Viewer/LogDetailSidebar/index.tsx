import { useState } from "react";

import { useUiStore } from "../../../store/uiStore";
import MessageSection from "./MessageSection";
import PropertiesSection from "./PropertiesSection";
import SidebarHeader from "./SidebarHeader";

export default function LogDetailSidebar() {
    const { selectedLogEntry, setSelectedLogEntry } = useUiStore();
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
                textToCopy = value.map((item) => String(item)).join("\n");
            } else if (typeof value === "object" && value !== null) {
                textToCopy = JSON.stringify(value, null, 2);
            } else {
                textToCopy = String(value);
            }

            await navigator.clipboard.writeText(textToCopy);
            setCopiedField(key);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Separate message from other properties
    const { message, ...otherProperties } = selectedLogEntry;

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col">
            <SidebarHeader onClose={handleClose} />

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                {message && (
                    <MessageSection
                        message={message}
                        onCopy={() => handleCopy("message", message)}
                        isCopied={copiedField === "message"}
                    />
                )}

                <PropertiesSection
                    properties={otherProperties}
                    onCopy={handleCopy}
                    copiedField={copiedField}
                />
            </div>
        </div>
    );
}
