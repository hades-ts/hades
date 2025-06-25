export default [
    [
        "classic",
        {
            docs: false,
            blog: {
                showReadingTime: true,
                editUrl:
                    "https://github.com/hades-ts/hades/tree/main/apps/docs/blog/",
            },
            theme: {
                customCss: require.resolve("../src/css/custom.scss"),
            },
        },
    ],
];
