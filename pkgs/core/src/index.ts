import "reflect-metadata";

import { Container, type Newable } from "inversify";
import {
    type ConfigOptions,
    withConfig,
} from "./config/loadConfigurationModule";
import { withDecorators } from "./decorators";
import { withServices } from "./decorators/service";
import { withEvents } from "./events";
import { Installer } from "./Installer";
import { ILoginService } from "./login";
import { withLogin } from "./login/LoginInstaller";
import type { InstallerFunc } from "./utils";

export * from "./decorators";
export * from "./events";
export * from "./Installer";
export * from "./interactions";
export * from "./login";
export * from "./services";
export * from "./utils";

export type BootOptions = {
    installers?: (Installer | InstallerFunc)[];
    configOptions?: ConfigOptions;
};

export const boot = async (botService: Newable<any>, options?: BootOptions) => {
    try {
        const container = new Container();
        container.bind(Container).toConstantValue(container);

        const userInstallers = options?.installers ?? [];
        const configOptions = options?.configOptions ?? {};

        for (const installer of [
            withDecorators,
            withConfig({
                prefix: "cfg",
                objects: true,
                ...configOptions,
            }),
            withEvents,
            withLogin,
            ...userInstallers,
            withServices,
        ]) {
            if (installer instanceof Installer) {
                void installer.install(container);
            } else {
                installer(container);
            }
        }

        void container.get(botService, { autobind: true });
        const ls = container.get(ILoginService);
        await ls.login();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
