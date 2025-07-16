import type { LoggerMeta } from "./LoggerMeta";
import { ProxyLogger } from "./ProxyLogger";

export class NullProxyLogger extends ProxyLogger {
    override write(_message: string, _meta: LoggerMeta): void {
        return;
    }
}
