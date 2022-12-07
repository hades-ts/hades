import { SidebarConfig } from "@site/node_modules/@docusaurus/plugin-content-docs/src/sidebars/types";
import { mkSection } from "./api";

import path from 'path';


export const mkSidebar = (rootPath): SidebarConfig => {
    const name = path.basename(rootPath)
    return {
        [name]: [
            mkSection(rootPath),
        ],
    };
}