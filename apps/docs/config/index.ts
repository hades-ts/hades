import { themes } from "prism-react-renderer";

import footer from "./footer";
import logo from "./logo";
import metadata from "./metadata";
import navbar from "./navbar";
import plugins from "./plugins";
import presets from "./presets";

async function createConfig() {
    return {
        ...metadata,

        onBrokenLinks: "warn",
        onBrokenMarkdownLinks: "warn",
        favicon: "img/favicon.ico",

        i18n: {
            defaultLocale: "en",
            locales: ["en"],
        },

        plugins: await plugins(),
        presets,

        themeConfig: {
            forceDarkMode: true,
            docs: {
                sidebar: {
                    hideable: true,
                    autoCollapseCategories: true,
                },
            },
            navbar: {
                logo,
                items: navbar,
            },
            footer,
            prism: {
                theme: themes.github,
                darkTheme: themes.dracula,
            },
        },
    };
}

export default createConfig;
