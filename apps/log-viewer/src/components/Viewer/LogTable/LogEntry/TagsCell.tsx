import { TableCell } from "@/components/ui/table";

const formatTags = (tags: unknown) => {
    if (!tags) return "-";

    if (Array.isArray(tags)) {
        return tags.map((tag) => String(tag)).join(", ");
    }

    if (typeof tags === "object") {
        return JSON.stringify(tags);
    }

    return String(tags);
};

interface TagsCellProps {
    tags: unknown;
}

export default function TagsCell({ tags }: TagsCellProps) {
    const formattedTags = formatTags(tags);

    return (
        <TableCell className="text-slate-400 text-xs">
            <div className="truncate max-w-32" title={formattedTags}>
                {formattedTags}
            </div>
        </TableCell>
    );
} 