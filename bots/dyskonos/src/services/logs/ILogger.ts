import type { Container, Newable } from "inversify";

export abstract class ILogger {
    abstract info(message: string): void;
    abstract warn(message: string): void;
    abstract error(message: string): void;

    static install(logger: Newable<ILogger>) {
        return (container: Container) => {
            container.bind(ILogger).to(logger).inSingletonScope();
        };
    }
}
