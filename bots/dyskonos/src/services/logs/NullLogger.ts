import { injectable } from "inversify";
import { ILogger } from "./ILogger";

@injectable()
export class NullLogger implements ILogger {
    info(message: string): void {
        return;
    }

    warn(message: string): void {
        return;
    }

    error(message: string): void {
        return;
    }
}