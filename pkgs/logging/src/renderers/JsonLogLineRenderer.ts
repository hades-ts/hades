import type { ILogRenderer } from "../ILogRenderer";
import type { LoggerMeta } from "../LoggerMeta";
import { LogLevels } from "../LogLevel";

export class JsonLogLineRenderer implements ILogRenderer {
    render(message: string, meta: LoggerMeta): string {
        return `${JSON.stringify({
            ...meta,
            message,
            level: LogLevels[meta.level],
        })}\n`;
    }
}
