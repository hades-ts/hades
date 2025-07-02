import type { LogFile } from "../../../types";

interface FileInfoProps {
    file: LogFile | null;
    isWatching: boolean;
}

export default function FileInfo({ file, isWatching }: FileInfoProps) {
    return (
        <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                JSON Log Viewer
            </h1>
            <p className="text-sm text-slate-400">
                {file ? file.file.name : "No file selected"}
                {isWatching && (
                    <span className="ml-2 text-green-400">
                        • Live
                    </span>
                )}
            </p>
        </div>
    );
} 