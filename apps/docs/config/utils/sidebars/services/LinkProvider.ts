import { SidebarItemCategoryLinkDoc, SidebarItemCategoryLinkGeneratedIndex } from "@docusaurus/plugin-content-docs/src/sidebars/types";
import { inject, injectable, postConstruct } from "inversify";
import { capitalize } from "../utils";
import { SectionEntryProvider } from "./EntryProvider";
import { SectionMetadataProvider } from "./MetadataProvider";


@injectable()
export class SectionLinkProvider {

    @inject('SubSectionName')
    private subSectionName: string;

    @inject('SubSectionId')
    private subSectionId: string;

    @inject(SectionMetadataProvider)
    private metadataProvider: SectionMetadataProvider;

    @inject(SectionEntryProvider)
    private entryProvider: SectionEntryProvider;

    link: SidebarItemCategoryLinkDoc | SidebarItemCategoryLinkGeneratedIndex;

    @postConstruct()
    init() {
        this.link = this.getLink()
    }

    getLink() {
        const hasIndex =
            this.entryProvider.entries.includes('index.md') ||
            this.entryProvider.entries.includes('index.mdx');

        const { label, description, image, keywords } = this.metadataProvider.metadata

        return hasIndex
            ? { type: 'doc', id: this.subSectionId } as SidebarItemCategoryLinkDoc
            : {
                type: 'generated-index',
                title: label || `${capitalize(this.subSectionName)} Index`,
                description,
                image,
                keywords,
            } as unknown as SidebarItemCategoryLinkGeneratedIndex
    }
}