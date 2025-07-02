import { X } from "lucide-react";

interface SidebarHeaderProps {
    onClose: () => void;
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
    return (
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
            <h2 className="text-lg font-semibold text-white">
                Log Details
            </h2>
            <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
} 