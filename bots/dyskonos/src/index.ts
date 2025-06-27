import "reflect-metadata";

import * as dotenv from "dotenv";

dotenv.config();

import { boot } from "@hades-ts/core";
import { withSlashCommands } from "@hades-ts/slash-commands";
import { withHelp } from "@hades-ts/slash-help";

import { BotService } from "./services";

import "./slash-commands";
import { withGuilds } from "@hades-ts/guilds";
import { ConsoleLogger } from "./services/logs/ConsoleLogger";
import { ILogger } from "./services/logs/ILogger";

boot(BotService, {
    installers: [
        withGuilds(),
        withSlashCommands(),
        withHelp(),
        (c) => c.bind(ILogger).to(ConsoleLogger).inSingletonScope(),
    ],
});
