import matter from "gray-matter";
import { readFileSync } from "fs";
import { basename, join } from "path";
import { SidebarItemDocEntry } from "../types";
import { isMarkdown, isntEmpty, isntIndex, removeExtension, removeLeadingSlashes, removeNumericPrefix } from "../utils";
import { SectionEntryProvider } from "./EntryProvider";
import { inject, injectable, postConstruct } from "inversify";


@injectable()
export class SectionFileProvider {

    @inject('SectionRoot')
    private sectionRoot: string

    @inject('RelativePath')
    private relativePath: string

    @inject('IsSectionFile')
    isSectionFile: (relPath: any) => any;

    @inject('IdMaker')
    private makeFileId: (entry: string) => string

    @inject(SectionEntryProvider)
    entryProvider: SectionEntryProvider;

    files: SidebarItemDocEntry[];

    @postConstruct()
    init() {
        this.files = this.getFiles()
    }

    getFiles(): SidebarItemDocEntry[] {
        return this.entryProvider.entries
            .filters(this.isSectionFile, isMarkdown, isntEmpty, isntIndex)
            .map(e => this.itemizeFile(e))
    }

    itemizeFile(entry: string): SidebarItemDocEntry {
        const id = this.makeFileId(entry)
        const fullPath = join(this.sectionRoot, this.relativePath, entry)
        const text = readFileSync(fullPath, 'utf8')
        const meta = matter(text) as any
        const label = meta.data.label || undefined

        return {
            id,
            label,
            name: basename(id),
            type: 'doc',
        }
    }
}