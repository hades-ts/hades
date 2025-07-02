import "reflect-metadata";
import "./slash-commands";

import * as dotenv from "dotenv";

import { boot } from "@hades-ts/core";
import { withSlashCommands } from "@hades-ts/slash-commands";

import { BotService } from "./services/BotService";

dotenv.config();

boot(BotService, {
    installers: [withSlashCommands()],
});
