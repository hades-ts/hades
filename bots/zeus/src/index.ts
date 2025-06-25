import "reflect-metadata";
import "./slash-commands";

import { HadesContainer } from "@hades-ts/hades";
import { SlashCommandsInstaller } from "@hades-ts/slash-commands";
import { GuildManager } from "discord.js";
import * as dotenv from "dotenv";

import { configSchema } from "./config";
import { BotService } from "./services/BotService";

dotenv.config();

// TODO: use boot
(async () => {
    const container = new HadesContainer({
        installers: [new SlashCommandsInstaller()],
        configOptions: {
            schema: configSchema,
        },
    });

    container.bind(GuildManager).toSelf().inSingletonScope();

    const bot = container.get(BotService);
    await bot.login();
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
