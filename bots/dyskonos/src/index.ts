import "reflect-metadata";

import * as dotenv from "dotenv";
dotenv.config();

import { boot, Installer } from "@hades-ts/hades";
import { SlashCommandsInstaller } from "@hades-ts/slash-commands";

import { BotService } from "./services";

import "./slash-commands";
import { ILogger } from "./services/logs/ILogger";
import { ConsoleLogger } from "./services/logs/ConsoleLogger";

boot(BotService, [
    new SlashCommandsInstaller(),
    (c) => c.bind(ILogger).to(ConsoleLogger).inSingletonScope(),
]);
