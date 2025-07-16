import "reflect-metadata";

import * as dotenv from "dotenv";

dotenv.config();

import { boot } from "@hades-ts/core";
import { withSlashCommands } from "@hades-ts/slash-commands";
import { withHelp } from "@hades-ts/slash-help";

import { BotService } from "./services";

import "./guildServices";
import "./slash-commands";

import {
    GuildPrefixLogLineRenderer,
    withGuildLogging,
    withGuilds,
} from "@hades-ts/guilds";
import { withInteractions } from "@hades-ts/interactions";
import {
    LogLevel,
    withConsoleSink,
    withJsonSink,
    withLogging,
} from "@hades-ts/logging";

const level = LogLevel.DEBUG;

boot(BotService, {
    installers: [
        withLogging({
            level,
            sinks: [withConsoleSink(), withJsonSink("logs/dyskonos.json")],
        }),
        withGuilds(
            withGuildLogging({
                level,
                sinks: [
                    withConsoleSink(GuildPrefixLogLineRenderer),
                    withJsonSink("logs/dyskonos.json"),
                ],
            }),
        ),
        withSlashCommands(),
        withInteractions(),
        withHelp(),
    ],
});
