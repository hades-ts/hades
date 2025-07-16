import { inject } from "inversify";

import { ILogRenderer } from "../ILogRenderer";
import type { LoggerMeta } from "../LoggerMeta";
import { LogLevel } from "../LogLevel";
import type { ILogSink } from "./ILogSink";

export class ConsoleSink implements ILogSink {
    type = "console";

    @inject(ILogRenderer)
    protected renderer!: ILogRenderer;

    write(message: string, meta: LoggerMeta) {
        switch (meta.level) {
            case LogLevel.INFO:
                console.log(this.renderer.render(message, meta));
                break;
            case LogLevel.WARN:
                console.warn(this.renderer.render(message, meta));
                break;
            case LogLevel.ERROR:
                console.error(this.renderer.render(message, meta));
                break;
            case LogLevel.DEBUG:
                console.debug(this.renderer.render(message, meta));
                break;
        }
    }
}
