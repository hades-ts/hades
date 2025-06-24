import "reflect-metadata";
import "./slash-commands";

import { boot, HadesContainer } from "@hades-ts/hades";
import { SlashCommandsInstaller } from "@hades-ts/slash-commands";
import * as dotenv from "dotenv";

import { BotService } from "./services/BotService";

dotenv.config();

boot(BotService, [
    new SlashCommandsInstaller(),
])