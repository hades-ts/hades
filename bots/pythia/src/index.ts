import "reflect-metadata";
import * as dotenv from "dotenv";

dotenv.config();

import { boot } from "@hades-ts/hades";
import { withSlashCommands } from "@hades-ts/slash-commands";

import "@hades-ts/slash-commands/dist/builtins/commands/HelpCommand";

import { BotService } from "./services/BotService";

import "./slash-commands";
import { configSchema } from "./config";

boot(BotService, {
    installers: [withSlashCommands()],
    configOptions: {
        schema: configSchema,
    },
});
