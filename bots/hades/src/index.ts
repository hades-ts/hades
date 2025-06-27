import "reflect-metadata";
import "./slash-commands";

import { boot } from "@hades-ts/hades";
import { withSlashCommands } from "@hades-ts/slash-commands";
import * as dotenv from "dotenv";

import { BotService } from "./services/BotService";

dotenv.config();

boot(BotService, {
    installers: [withSlashCommands()],
});
