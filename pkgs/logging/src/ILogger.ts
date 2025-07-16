export abstract class ILogger {
    abstract info(message: string, meta?: Record<string, any>): void;
    abstract warn(message: string, meta?: Record<string, any>): void;
    abstract error(message: string, meta?: Record<string, any>): void;
    abstract debug(message: string, meta?: Record<string, any>): void;
}
