import { type ILogRenderer, LogLevels } from "@hades-ts/logging";

import type { GuildLoggerMeta } from "./GuildLoggerMeta";

export class GuildPrefixLogLineRenderer implements ILogRenderer {
    render(message: string, meta: GuildLoggerMeta): string {
        return `[${meta.name}] [${LogLevels[meta.level]}] [${meta.guildId}] ${message}\n`;
    }
}
