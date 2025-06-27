import "reflect-metadata";

import * as dotenv from "dotenv";

dotenv.config();

import { boot } from "@hades-ts/hades";
import { withSlashCommands } from "@hades-ts/slash-commands";

import { BotService } from "./services";

import "./slash-commands";

boot(BotService, {
    installers: [withSlashCommands()],
});
