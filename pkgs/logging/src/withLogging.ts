import type { Container } from "inversify";

import { findLoggers, type LoggerDecoratorParams } from "./logger";
import type { LogLevel } from "./LogLevel";
import { NullProxyLogger } from "./NullProxyLogger";
import { ProxyLogger } from "./ProxyLogger";
import { ILogSink } from "./sinks/ILogSink";
import { isEnabled } from "./utils";

export type LoggingOptions = {
    level: LogLevel;
    disabledTags?: string[];
    sinks?: ((container: Container) => void)[];
};

export const withLogging =
    ({ level, disabledTags, sinks }: LoggingOptions) =>
    (container: Container) => {
        const _disabledTags = disabledTags ?? [];

        const loggers = findLoggers();

        if (loggers.size === 0) {
            console.log("No use of @logger decorator found.");
            return;
        }

        for (const sinkInstaller of sinks ?? []) {
            sinkInstaller(container);
        }

        if (!container.isBound(ILogSink)) {
            throw new Error(
                "ILogSink is not bound. Did you forget to bind it?",
            );
        }

        if (!container.isBound(ProxyLogger)) {
            container.bind(ProxyLogger).to(ProxyLogger).inTransientScope();
        }

        for (const [_, loggerMeta] of loggers) {
            const members = Object.values(loggerMeta.members);

            for (const member of members) {
                const data = member.data as unknown as LoggerDecoratorParams;
                container
                    .bind(Symbol.for(data.id))
                    .toDynamicValue((ctx) => {
                        if (!isEnabled(_disabledTags, data)) {
                            return new NullProxyLogger();
                        }
                        const logger = ctx.get(ProxyLogger);
                        logger.name = data.name;
                        logger.tags = data.tags;
                        logger.level = level;
                        return logger;
                    })
                    .inSingletonScope()
                    .whenNamed(data.id);
            }
        }
    };
