interface SelectFileButtonProps {
    onSelectFile: () => void;
}

export default function SelectFileButton({ onSelectFile }: SelectFileButtonProps) {
    return (
        <button
            type="button"
            onClick={onSelectFile}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium"
        >
            Select File
        </button>
    );
} 