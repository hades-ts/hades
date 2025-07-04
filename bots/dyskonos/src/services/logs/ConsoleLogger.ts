import { injectable } from "inversify";

import type { ILogger } from "./ILogger";

@injectable()
export class ConsoleLogger implements ILogger {
    info(message: string): void {
        console.log(message);
    }

    warn(message: string): void {
        console.warn(message);
    }

    error(message: string): void {
        console.error(message);
    }
}
