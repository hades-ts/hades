export const mkSection = async (name) => {
    const mdxMermaid = await import("mdx-mermaid");

    return [
        "@docusaurus/plugin-content-docs",
        {
            id: name,
            path: `./docs/${name}/`,
            routeBasePath: `docs/${name}`,
            sidebarPath: require.resolve(`../sidebars/${name}.ts`),
            remarkPlugins: [mdxMermaid.default],
        },
    ];
};
