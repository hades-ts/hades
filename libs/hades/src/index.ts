import { interfaces } from "inversify";
import { HadesBotService } from "./services";
import { Installer } from "./Installer";
import { HadesContainer } from "./HadesContainer";
import { InstallerFunc } from "./utils";

export * from "./decorators";
export * from "./HadesContainer";
export * from "./Installer";
export * from "./interactions";
export * from "./services";
export * from "./utils";


export const boot = async (
    botService: interfaces.Newable<HadesBotService>,
    installers?: (Installer | InstallerFunc)[]
) => {
    try {
        const container = new HadesContainer({
            installers: installers ?? [],
        });
        container.bind(botService).toSelf().inSingletonScope();
        const bot = container.get(botService);
        await bot.login();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}