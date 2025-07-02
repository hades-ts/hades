import ControlButtons from "./ControlButtons";
import LogStats from "./LogStats";

export default function StatsAndControls() {
    return (
        <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
            <LogStats />
            <ControlButtons />
        </div>
    );
}
