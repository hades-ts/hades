import "reflect-metadata";

import configFactory from "./config";

const configurator = async () => {
    const config = await configFactory();
    console.log(config);
    return config;
};

export default configurator;
