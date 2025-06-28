import "reflect-metadata";
import * as dotenv from "dotenv";

dotenv.config();

import { boot } from "@hades-ts/core";
import { withSlashCommands } from "@hades-ts/slash-commands";
import { withHelp } from "@hades-ts/slash-help";

import "@hades-ts/slash-commands/dist/builtins/commands/HelpCommand";

import { BotService } from "./services/BotService";

import "./slash-commands";
import { configSchema } from "./config";
import { withGuilds } from "@hades-ts/guilds";
import { withDb } from "./db";

boot(BotService, {
    installers: [
        withDb(),
        withGuilds(),
        withSlashCommands(),
        withHelp(),
    ],
    configOptions: {
        schema: configSchema,
    },
});
