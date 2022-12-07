require('ts-node').register()
require('ts-node').register = function () { }
require("reflect-metadata");

const configFactory = require('./config').default

const configurator = async () => {
    const config = await configFactory()
    console.log(config)
    return config
}

module.exports = configurator;