import "reflect-metadata";

import type { Newable } from "inversify";
import { install } from "./decorators";
import { HadesContainer } from "./HadesContainer";
import type { Installer } from "./Installer";
import { type HadesBotService, HadesClient } from "./services";
import type { InstallerFunc } from "./utils";

export * from "./decorators";
export * from "./HadesContainer";
export * from "./Installer";
export * from "./interactions";
export * from "./services";
export * from "./utils";

export const boot = async (
    botService: Newable<HadesBotService>,
    installers?: (Installer | InstallerFunc)[],
) => {
    try {
        const container = new HadesContainer({
            installers: installers ?? [],
        });
        install(container);
        console.log(`client is bound: ${container.isBound(HadesClient)}`);
        const bot = container.get(botService);
        await bot.login();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
