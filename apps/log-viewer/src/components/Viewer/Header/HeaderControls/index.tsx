import type { LogFile } from "../../../../types";
import SelectFileButton from "./SelectFileButton";
import WatchToggleButton from "./WatchToggleButton";

interface HeaderControlsProps {
    file: LogFile | null;
    isWatching: boolean;
    onSelectFile: () => void;
    onToggleWatching: () => void;
}

export default function HeaderControls({
    file,
    isWatching,
    onSelectFile,
    onToggleWatching,
}: HeaderControlsProps) {
    return (
        <div className="flex items-center gap-3">
            <SelectFileButton onSelectFile={onSelectFile} />
            {file && (
                <WatchToggleButton
                    isWatching={isWatching}
                    onToggleWatching={onToggleWatching}
                />
            )}
        </div>
    );
} 