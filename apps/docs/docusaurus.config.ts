import "reflect-metadata";

import configFactory from "./config";

const configurator = async () => {
    const config = await configFactory();
    return config;
};

export default configurator;
