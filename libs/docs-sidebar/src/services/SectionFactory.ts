import { inject, injectable, postConstruct } from "inversify";
import type { SidebarItemCategoryEntry } from "../types";
import { capitalize } from "../utils";
import { SectionItemProvider } from "./ItemProvider";
import { SectionLinkProvider } from "./LinkProvider";
import { SectionMetadataProvider } from "./MetadataProvider";

@injectable()
export class SectionFactory {
    @inject("SubSectionName")
    subSectionName!: string;

    @inject("SubSectionId")
    subSectionId!: string;

    @inject("Collapsible")
    collapsible!: boolean;

    @inject(SectionMetadataProvider)
    metadataProvider!: SectionMetadataProvider;

    @inject(SectionLinkProvider)
    linkProvider!: SectionLinkProvider;

    @inject(SectionItemProvider)
    itemProvider!: SectionItemProvider;

    @postConstruct()
    init() {
        this.meta.collapsible = this.collapsible || true;
    }

    private get link() {
        return this.linkProvider.link;
    }
    private get meta() {
        return this.metadataProvider.metadata;
    }
    private get items() {
        return this.itemProvider.getItems();
    }
    private get label() {
        return this.meta.label || this.meta.title || capitalize(this.subSectionName);
    }
    private get id() {
        return this.subSectionId;
    }

    create(): SidebarItemCategoryEntry {
        const { collapsed, collapsible, description } = this.meta;
        return {
            name: this.subSectionName,
            id: this.id,
            type: "category",
            label: this.label,
            customProps: {
                description,
            },
            link: this.link,
            items: this.items,
            collapsible: collapsible === null || collapsible === undefined ? true : !!collapsible,
            collapsed: collapsed === null || collapsed === undefined ? true : !!collapsed,
        };
    }
}
