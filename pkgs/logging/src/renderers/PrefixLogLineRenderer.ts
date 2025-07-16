import type { ILogRenderer } from "../ILogRenderer";
import type { LoggerMeta } from "../LoggerMeta";
import { LogLevels } from "../LogLevel";

export class PrefixLogLineRenderer implements ILogRenderer {
    render(message: string, meta: LoggerMeta): string {
        return `[${meta.name}] [${LogLevels[meta.level]}] ${message}\n`;
    }
}
