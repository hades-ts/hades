import type { LoggerMeta } from "../LoggerMeta";
import type { ILogSink } from "./ILogSink";

export class NullSink implements ILogSink {
    type = "null";
    write(_message: string, _meta: LoggerMeta): void {
        return;
    }
}
