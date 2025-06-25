import "reflect-metadata";
import "./slash-commands";

import { boot } from "@hades-ts/hades";
import { SlashCommandsInstaller } from "@hades-ts/slash-commands";
import * as dotenv from "dotenv";

import { BotService } from "./services/BotService";

dotenv.config();

async () => boot(BotService, [new SlashCommandsInstaller()]);
