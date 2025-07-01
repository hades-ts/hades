import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import { boot } from "@hades-ts/core";
import { withSlashCommands } from "@hades-ts/slash-commands";
import { withHelp } from "@hades-ts/slash-help";

import { BotService } from "./services/BotService";

import "./slash-commands";
import "./guildServices";
import { withGuilds } from "@hades-ts/guilds";
import { configSchema } from "./config";
import { withDb } from "./db";

boot(BotService, {
    installers: [withDb(), withGuilds(), withSlashCommands(), withHelp()],
    configOptions: {
        schema: configSchema,
    },
});
