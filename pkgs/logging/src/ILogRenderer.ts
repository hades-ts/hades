import type { LoggerMeta } from "./LoggerMeta";

export abstract class ILogRenderer {
    abstract render(message: string, meta: LoggerMeta): string;
}
