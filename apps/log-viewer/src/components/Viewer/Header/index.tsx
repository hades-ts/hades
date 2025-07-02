import type { LogFile } from "../../../types";
import FileInfo from "./FileInfo";
import HeaderControls from "./HeaderControls";
import LogoSection from "./LogoSection";

interface HeaderProps {
    file: LogFile | null;
    isWatching: boolean;
    onSelectFile: () => void;
    onToggleWatching: () => void;
}

export default function Header({
    file,
    isWatching,
    onSelectFile,
    onToggleWatching,
}: HeaderProps) {
    return (
        <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LogoSection />
                        <FileInfo file={file} isWatching={isWatching} />
                    </div>
                    <HeaderControls
                        file={file}
                        isWatching={isWatching}
                        onSelectFile={onSelectFile}
                        onToggleWatching={onToggleWatching}
                    />
                </div>
            </div>
        </div>
    );
}
