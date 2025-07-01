import "reflect-metadata";

import * as dotenv from "dotenv";

dotenv.config();

import { boot } from "@hades-ts/core";
import { withSlashCommands } from "@hades-ts/slash-commands";
import { withHelp } from "@hades-ts/slash-help";

import { BotService } from "./services";

import "./slash-commands";
import "./guildServices";

import { withGuilds } from "@hades-ts/guilds";
import { withInteractions } from "@hades-ts/interactions";
import { ConsoleLogger } from "./services/logs/ConsoleLogger";
import { ILogger } from "./services/logs/ILogger";

boot(BotService, {
    installers: [
        withGuilds(),
        withSlashCommands(),
        (c) => withInteractions(c),
        withHelp(),
        (c) => c.bind(ILogger).to(ConsoleLogger).inSingletonScope(),
    ],
});
