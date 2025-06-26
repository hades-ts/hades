import "reflect-metadata";

import type { Newable } from "inversify";
import { withDecorators } from "./decorators";
import { withEvents } from "./events";
import { HadesContainer } from "./HadesContainer";
import type { Installer } from "./Installer";
import type { HadesBotService } from "./services";
import { ILoginService } from "./services/ILogin";
import { LoginService } from "./services/LoginService";
import type { InstallerFunc } from "./utils";

export * from "./decorators";
export * from "./events";
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
            installers: [withDecorators, withEvents, ...(installers ?? [])],
        });
        void container.get(botService);

        if (!container.isBound(ILoginService)) {
            container.bind(ILoginService).to(LoginService);
        }
        const ls = container.get(ILoginService);
        await ls.login();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
