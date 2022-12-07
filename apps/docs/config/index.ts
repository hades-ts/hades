import lightCodeTheme from 'prism-react-renderer/themes/github';
import darkCodeTheme from 'prism-react-renderer/themes/dracula';
import metadata from './metadata'
import plugins from './plugins'
import presets from './presets'
import navbar from './navbar'
import footer from './footer'
import logo from './logo'

async function createConfig() {
    return {
        ...metadata,

        onBrokenLinks: 'warn',
        onBrokenMarkdownLinks: 'warn',
        favicon: 'img/favicon.ico',

        i18n: {
            defaultLocale: 'en',
            locales: ['en'],
        },

        plugins: await plugins(),
        presets,

        themeConfig:
            ({
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
                    theme: lightCodeTheme,
                    darkTheme: darkCodeTheme,
                },
            }),
    };
}

export default createConfig;
