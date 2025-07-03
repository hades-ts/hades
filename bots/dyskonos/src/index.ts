import "reflect-metadata";

import * as dotenv from "dotenv";

dotenv.config();

import { boot } from "@hades-ts/core";
import { withSlashCommands } from "@hades-ts/slash-commands";
import { withHelp } from "@hades-ts/slash-help";

import { BotService } from "./services";

import "./guildServices";
import "./slash-commands";

import { withGuilds } from "@hades-ts/guilds";
import { withInteractions } from "@hades-ts/interactions";
import { LogLevel, withJsonLogging } from "@hades-ts/logging";

boot(BotService, {
    installers: [
        withJsonLogging("logs/dyskonos.json", LogLevel.DEBUG),
        withGuilds(),
        withSlashCommands(),
        (c) => withInteractions(c),
        withHelp(),
    ],
});
