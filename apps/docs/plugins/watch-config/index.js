module.exports = (context, _options) => ({
    name: "docusaurus-watch-config",
    getPathsToWatch() {
        return [`${context.siteDir}/config`];
    },
});
