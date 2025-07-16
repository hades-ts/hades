import type { LogLevel } from "./LogLevel";

export type LoggerMeta = {
    name: string;
    tags: string[];
    level: LogLevel;
} & Record<string, any>;
