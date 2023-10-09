import "reflect-metadata";
import "./slash-commands";

import { HadesContainer } from "@hades-ts/hades";
import { SlashCommandsInstaller } from "@hades-ts/slash-commands";
import { TextCommandsInstaller } from "@hades-ts/text-commands";
import * as dotenv from "dotenv";

import { configSchema } from "./config";
import { BotService } from "./services/BotService";

dotenv.config();

(async () => {
    const container = new HadesContainer({
        installers: [new TextCommandsInstaller(), new SlashCommandsInstaller()],
        configOptions: {
            schema: configSchema,
        },
    });

    const bot = container.get(BotService);
    await bot.login();
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
