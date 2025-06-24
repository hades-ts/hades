import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import { mkSection } from "./api";

import path from "path";

export const mkSidebar = (rootPath: string): SidebarsConfig => {
    const name = path.basename(rootPath);
    return {
        [name]: [mkSection(rootPath)],
    };
};
