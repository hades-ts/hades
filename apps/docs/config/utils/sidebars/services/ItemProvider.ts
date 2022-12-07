import { SidebarItem } from "@docusaurus/plugin-content-docs/src/sidebars/types"
import { inject, injectable } from "inversify"
import { SidebarEntry } from "../types"
import { SectionDirectoryProvider } from "./DirectoryProvider"
import { SectionFileProvider } from "./FileProvider"
import { SectionMetadataProvider } from "./MetadataProvider"


@injectable()
export class SectionItemProvider {

    @inject(SectionMetadataProvider)
    private metadataProvider: SectionMetadataProvider;

    @inject(SectionFileProvider)
    private fileProvider: SectionFileProvider;

    @inject(SectionDirectoryProvider)
    private directoryProvider: SectionDirectoryProvider;

    getItems(): SidebarItem[] {
        const allItems: SidebarEntry[] = [
            ...this.fileProvider.files,
            ...this.directoryProvider.directories,
        ]

        const sortedItems: SidebarEntry[] = []

        const { order } = this.metadataProvider.metadata

        if (order) {
            for (const id of order) {
                const item = allItems.find(item => item.name === id)
                if (item) {
                    sortedItems.push(item)
                    // remove item from allItems
                    allItems.splice(allItems.indexOf(item), 1)
                }
            }

            // add remaining items
            sortedItems.push(...allItems)
        } else {
            sortedItems.push(...allItems)
        }

        return sortedItems.map(item => {
            if (item.type === 'category') {
                const { id, name, ...category } = item
                return category
            } else {
                const { name, ...doc } = item
                return doc
            }
        })
    }
}