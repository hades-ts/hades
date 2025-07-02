import { FileText } from "lucide-react";

interface EmptyStateProps {
    hasLogs: boolean;
}

export default function EmptyState({ hasLogs }: EmptyStateProps) {
    return (
        <div className="text-center py-12 text-slate-400">
            {!hasLogs ? (
                <div>
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a log file to start</p>
                </div>
            ) : (
                <p>No entries match the current filters</p>
            )}
        </div>
    );
} 