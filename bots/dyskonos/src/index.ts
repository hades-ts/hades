import "reflect-metadata";

import * as dotenv from "dotenv";

dotenv.config();

import { boot } from "@hades-ts/hades";
import { SlashCommandsInstaller } from "@hades-ts/slash-commands";

import { BotService } from "./services";

import "./slash-commands";
import { ConsoleLogger } from "./services/logs/ConsoleLogger";
import { ILogger } from "./services/logs/ILogger";

boot(BotService, [
    new SlashCommandsInstaller(),
    (c) => c.bind(ILogger).to(ConsoleLogger).inSingletonScope(),
]);
