import { SidebarConfig } from "@docusaurus/plugin-content-docs/src/sidebars/types";
import { mkSection } from "./api";

import path from "path";

export const mkSidebar = (rootPath: string): SidebarConfig => {
    const name = path.basename(rootPath);
    return {
        [name]: [mkSection(rootPath)],
    };
};
