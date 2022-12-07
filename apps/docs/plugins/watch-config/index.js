const path = require('path');
module.exports = function (context, options) {
    return {
        name: 'docusaurus-watch-config',
        getPathsToWatch() {
            return [
                `${context.siteDir}/config`,
            ];
        },
    };
};