import { readdirSync } from 'fs';
import path from 'path';

import { inject, injectable, postConstruct } from "inversify";
import { mkSubSection } from "../api";
import { SidebarItemCategoryEntry } from "../types";
import { removeLeadingSlashes, isntEmpty } from "../utils";
import { SectionEntryProvider } from "./EntryProvider";


@injectable()
export class SectionDirectoryProvider {

    @inject('SectionRoot')
    private sectionRoot: string

    @inject('Relativizer')
    private relativizePath: (...paths: string[]) => string;

    @inject('IsSectionDirectory')
    private isSectionDirectory: (relPath: string) => string;

    @inject(SectionEntryProvider)
    private entryProvider: SectionEntryProvider

    directories: SidebarItemCategoryEntry[]

    @postConstruct()
    init() {
        this.directories = this.getDirectories()
    }

    protected getDirectories(): SidebarItemCategoryEntry[] {
        return this.entryProvider.entries
            .filter(this.isSectionDirectory)
            .maps(this.relativizePath, removeLeadingSlashes)
            .map(entry => mkSubSection(this.sectionRoot, entry))
    }
}
