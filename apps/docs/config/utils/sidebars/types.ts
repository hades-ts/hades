import { SidebarItem, SidebarItemCategory, SidebarItemDoc } from "@docusaurus/plugin-content-docs/src/sidebars/types"

export type SidebarItemCategoryEntry = SidebarItemCategory & {
    id: string
    name: string,
    items: SidebarItem[]
}

export type SidebarItemDocEntry = SidebarItemDoc & {
    name: string,
}

export type SidebarEntry = SidebarItemCategoryEntry | SidebarItemDocEntry

export type SectionMetadata = Partial<{
    label: string,
    title: string,
    description: string,
    image: string,
    keywords: string[],
    order: string[],
    collapsible: boolean,
    collapsed: boolean,
}>