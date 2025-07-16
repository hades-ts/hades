import type { LogLevel } from "@hades-ts/logging";

export type GuildLoggerMeta = {
    name: string;
    tags: string[];
    level: LogLevel;
    guildId: string;
} & Record<string, any>;
