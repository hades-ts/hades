import { readFileSync } from "fs";
import { inject, injectable, postConstruct } from "inversify";
import matter from "gray-matter";

import { join } from "@reliverse/pathkit";
import type { SectionMetadata } from "../types";
import { SectionEntryProvider } from "./EntryProvider";

@injectable()
export class SectionMetadataProvider {
    @inject("SubSectionRoot")
    subSectionRoot!: string;

    @inject(SectionEntryProvider)
    entryProvider!: SectionEntryProvider;

    private metadataPath!: string;
    metadata!: SectionMetadata;

    @postConstruct()
    init() {
        this.metadataPath = join(this.subSectionRoot, "section.json");
        this.metadata = this.getMetadata();
    }

    getIndexMeta() {
        const indexPath = this.entryProvider.entries.includes("index.md")
            ? join(this.subSectionRoot, "index.md")
            : this.entryProvider.entries.includes("index.mdx")
              ? join(this.subSectionRoot, "index.mdx")
              : null;

        if (indexPath) {
            const indexContent = readFileSync(indexPath, "utf-8");
            const indexMeta = matter(indexContent);
            return indexMeta.data;
        }

        return {};
    }

    getSectionMeta() {
        const hasSectionFile =
            this.entryProvider.entries.includes("section.json");

        if (hasSectionFile) {
            return JSON.parse(readFileSync(this.metadataPath, "utf-8"));
        }

        return {};
    }

    protected getMetadata() {
        const meta: any = {
            ...this.getSectionMeta(),
            ...this.getIndexMeta(),
        };

        return meta as SectionMetadata;
    }
}
