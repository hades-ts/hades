import "reflect-metadata";

import * as dotenv from "dotenv";

dotenv.config();

import { boot, withEvents } from "@hades-ts/core";
import { withSlashCommands } from "@hades-ts/slash-commands";
import { withHelp } from "@hades-ts/slash-help";

import { BotService } from "./services";

import "./guildServices";
import "./slash-commands";

import { withGuilds } from "@hades-ts/guilds";
import { withInteractions } from "@hades-ts/interactions";
import { LogLevel, withJsonLogging, withLogging } from "@hades-ts/logging";

boot(BotService, {
    installers: [
        withJsonLogging("logs/dyskonos.json", LogLevel.DEBUG),
        withGuilds(withEvents(), withLogging(LogLevel.DEBUG)),
        withSlashCommands(),
        (c) => withInteractions(c),
        withHelp(),
    ],
});
