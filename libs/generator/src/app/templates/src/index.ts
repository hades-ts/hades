import "reflect-metadata";

import * as dotenv from "dotenv";
dotenv.config();

import { HadesContainer } from "@hades-ts/hades";
import { TextCommandsInstaller } from "@hades-ts/text-commands";
import { SlashCommandsInstaller } from "@hades-ts/slash-commands";

import { BotService } from "./services";

import "./slash-commands";

(async () => {
    const container = new HadesContainer({
        installers: [new TextCommandsInstaller(), new SlashCommandsInstaller()],
    });

    const bot = container.get(BotService);
    await bot.login();
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
