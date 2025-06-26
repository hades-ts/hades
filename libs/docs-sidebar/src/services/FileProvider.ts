import { readFileSync } from "node:fs";
import { basename, join } from "@reliverse/pathkit";
import matter from "gray-matter";
import { inject, injectable, postConstruct } from "inversify";
import type { SidebarItemDocEntry } from "../types";
import { isMarkdown, isntEmpty, isntIndex } from "../utils";
import { SectionEntryProvider } from "./EntryProvider";

@injectable()
export class SectionFileProvider {
    @inject("SectionRoot")
    sectionRoot!: string;

    @inject("RelativePath")
    relativePath!: string;

    @inject("IsSectionFile")
    isSectionFile!: (relPath: any) => any;

    @inject("IdMaker")
    private makeFileId!: (entry: string) => string;

    @inject(SectionEntryProvider)
    entryProvider!: SectionEntryProvider;

    files!: SidebarItemDocEntry[];

    @postConstruct()
    init() {
        this.files = this.getFiles();
    }

    getFiles(): SidebarItemDocEntry[] {
        return this.entryProvider.entries
            .filters(this.isSectionFile, isMarkdown, isntEmpty, isntIndex)
            .map((e) => this.itemizeFile(e));
    }

    itemizeFile(entry: string): SidebarItemDocEntry {
        const id = this.makeFileId(entry);
        const fullPath = join(this.sectionRoot, this.relativePath, entry);
        const text = readFileSync(fullPath, "utf8");
        const meta = matter(text) as any;
        const label = meta.data.label || undefined;

        return {
            id,
            label,
            name: basename(id),
            type: "doc",
        };
    }
}
