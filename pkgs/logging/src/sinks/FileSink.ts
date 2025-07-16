import fs from "node:fs";

import { inject } from "inversify";

import { ILogRenderer } from "../ILogRenderer";
import type { LoggerMeta } from "../LoggerMeta";
import type { ILogSink } from "./ILogSink";

export class FileSink implements ILogSink {
    type = "file";

    static Path = Symbol.for("FileLogger.Path");

    @inject(ILogRenderer)
    protected renderer!: ILogRenderer;

    @inject(FileSink.Path)
    protected path!: string;

    write(message: string, meta: LoggerMeta) {
        const line = this.renderer.render(message, meta);
        const path = this.path;
        const file = fs.openSync(path, "a");
        fs.writeSync(file, line);
        fs.closeSync(file);
    }
}
