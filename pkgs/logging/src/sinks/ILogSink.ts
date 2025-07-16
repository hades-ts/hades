import type { LoggerMeta } from "../LoggerMeta";

export abstract class ILogSink {
    abstract type: string;
    abstract write(message: string, meta: LoggerMeta): void;
}
