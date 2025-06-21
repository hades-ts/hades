import "reflect-metadata";

import * as dotenv from "dotenv";
dotenv.config();

import { HadesContainer } from "@hades-ts/hades";
import { SlashCommandsInstaller } from "@hades-ts/slash-commands";

import { BotService } from "./services";

import "./slash-commands";

(async () => {
    const container = new HadesContainer({
        installers: [new SlashCommandsInstaller()],
    });

    const bot = container.get(BotService);
    await bot.login();
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
