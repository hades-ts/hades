import { Container, injectable, injectFromBase, type Newable } from "inversify";

import {
    ConsoleLogger,
    FileLogger,
    findLoggers,
    ILogRenderer,
    ILogSink,
    isEnabled,
    JsonLogLineRenderer,
    type LogLevel,
    LogLevels,
    NullLogger,
    ProxyLogger,
} from "@hades-ts/logging";

import { GuildInfo } from "../GuildManager";

export type GuildLoggerDecoratorParams = {
    target: any;
    field: string;
    name: string;
    tags: string[];
    id: string;
};

export type GuildLoggerMeta = {
    name: string;
    tags: string[];
    level: LogLevel;
    guildId: string;
} & Record<string, any>;

@injectable()
@injectFromBase({
    extendConstructorArguments: false,
    extendProperties: true,
})
export class GuildProxyLogger extends ProxyLogger {
    protected guildId!: string;

    setGuildId(guildId: string) {
        this.guildId = guildId;
    }

    override meta(level: LogLevel, meta?: Record<string, any>) {
        return {
            ...super.meta(level, meta),
            guildId: this.guildId,
        };
    }
}

export class GuildPrefixLogLineRenderer implements ILogRenderer {
    render(message: string, meta: GuildLoggerMeta): string {
        return `[${meta.name}] [${LogLevels[meta.level]}] [${meta.guildId}] ${message}\n`;
    }
}

const fromSubContainer = <T>(
    parent: Container,
    token: Newable<T>,
    installer: (subContainer: Container) => void,
) => {
    const subContainer = new Container({ parent });
    installer(subContainer);
    return subContainer.get(token);
};

export const withGuildLogging =
    (level: LogLevel, disabledTags?: string[]) => (container: Container) => {
        const _disabledTags = disabledTags ?? [];

        if (!container.isBound(ILogSink)) {
            throw new Error(
                "ILogSink is not bound to guild container. Did you forget to bind it?",
            );
        }

        const loggers = findLoggers();

        if (loggers.size === 0) {
            console.log("No use of @guildLogger decorator found.");
            return;
        }

        container.bind(GuildProxyLogger).toSelf().inTransientScope();

        console.log(
            `Found ${loggers.size} loggers to bind to guild container.`,
        );

        for (const [_, loggerMeta] of loggers) {
            const members = Object.values(loggerMeta.members);

            for (const member of members) {
                const data =
                    member.data as unknown as GuildLoggerDecoratorParams;
                const enabled = isEnabled(_disabledTags, data);
                container
                    .bind(Symbol.for(data.id))
                    .toDynamicValue(() => {
                        const guildInfo = container.get(GuildInfo);
                        const logger = fromSubContainer(
                            container,
                            GuildProxyLogger,
                            (subContainer) => {
                                if (!enabled) {
                                    subContainer
                                        .bind(ILogSink)
                                        .to(NullLogger)
                                        .inSingletonScope();
                                }
                            },
                        );
                        logger.setName(data.name);
                        logger.setTags(data.tags);
                        logger.setLevel(level);
                        logger.setGuildId(guildInfo.id);
                        return logger;
                    })
                    .inSingletonScope()
                    .whenNamed(data.id);
            }
        }
    };

export const withConsoleGuildLogging =
    (level: LogLevel, disabledTags?: string[]) => (container: Container) => {
        container.bind(ILogSink).to(ConsoleLogger).inSingletonScope();
        container
            .bind(ILogRenderer)
            .to(GuildPrefixLogLineRenderer)
            .inSingletonScope();
        withGuildLogging(level, disabledTags)(container);
    };

export const withSingleFileGuildLogging =
    (path: string, level: LogLevel, disabledTags?: string[]) =>
    (container: Container) => {
        container.bind(ILogSink).to(FileLogger).inSingletonScope();
        container.bind(FileLogger.Path).toConstantValue(path);
        container
            .bind(ILogRenderer)
            .to(GuildPrefixLogLineRenderer)
            .inSingletonScope();
        withGuildLogging(level, disabledTags)(container);
    };

export const withSingleFileJsonGuildLogging =
    (path: string, level: LogLevel, disabledTags?: string[]) =>
    (container: Container) => {
        container.bind(ILogSink).to(FileLogger).inSingletonScope();
        container.bind(FileLogger.Path).toConstantValue(path);
        container.bind(ILogRenderer).to(JsonLogLineRenderer).inSingletonScope();
        withGuildLogging(level, disabledTags)(container);
    };
