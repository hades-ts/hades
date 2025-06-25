import { injectable } from "inversify";
import type { ILogger } from "./ILogger";

@injectable()
export class NullLogger implements ILogger {
    info(_message: string): void {
        return;
    }

    warn(_message: string): void {
        return;
    }

    error(_message: string): void {
        return;
    }
}
