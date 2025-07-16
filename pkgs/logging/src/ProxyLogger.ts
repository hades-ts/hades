import { multiInject } from "inversify";

import type { ILogger } from "./ILogger";
import type { LoggerMeta } from "./LoggerMeta";
import { LogLevel } from "./LogLevel";
import { ILogSink } from "./sinks/ILogSink";

export class ProxyLogger implements ILogger {
    // @inject(String)
    // @named("name")
    name!: string;

    // @inject(Array)
    // @named("tags")
    tags!: string[];

    // @inject(Number)
    // @named("level")
    level!: LogLevel;

    @multiInject(ILogSink)
    public logs!: ILogSink[];

    write(message: string, meta: LoggerMeta) {
        for (const log of this.logs) {
            log.write(message, meta);
        }
    }

    meta(level: LogLevel, meta?: Record<string, any>) {
        return {
            name: this.name,
            tags: this.tags,
            timestamp: new Date().toISOString(),
            level,
            ...meta,
        };
    }

    info(message: string, meta?: Record<string, any>) {
        if (this.level >= LogLevel.INFO) {
            this.write(message, this.meta(LogLevel.INFO, meta));
        }
    }
    warn(message: string, meta?: Record<string, any>) {
        if (this.level >= LogLevel.WARN) {
            this.write(message, this.meta(LogLevel.WARN, meta));
        }
    }
    error(message: string, meta?: Record<string, any>) {
        if (this.level >= LogLevel.ERROR) {
            this.write(message, this.meta(LogLevel.ERROR, meta));
        }
    }
    debug(message: string, meta?: Record<string, any>) {
        if (this.level >= LogLevel.DEBUG) {
            this.write(message, this.meta(LogLevel.DEBUG, meta));
        }
    }
}
