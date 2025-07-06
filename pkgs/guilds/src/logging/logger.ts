import { createMemberCategoric } from "@ldlework/categoric-decorators";
import { Container, inject, named, type Newable } from "inversify";

import {
    ConsoleLogger,
    FileLogger,
    ILogRenderer,
    ILogSink,
    isEnabled,
    JsonLogLineRenderer,
    type LogLevel,
    LogLevels,
    NullLogger,
    ProxyLogger,
} from "@hades-ts/logging";

export type GuildLoggerDecoratorParams = {
    target: any;
    field: string;
    name: string;
    tags: string[];
    id: string;
};

export const [_logger, findLoggers] =
    createMemberCategoric<GuildLoggerDecoratorParams>();

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const randomString = () => {
    let result = "";
    for (let i = 0; i < 10; i++) {
        result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
};

export const guildLogger =
    (name: string, ...tags: string[]) =>
    (target: any, field: string) => {
        const id = randomString();
        _logger({ target, field, name, tags, id })(target, field);
        inject(Symbol.for(id))(target, field);
        named(id)(target, field);
    };

export type GuildLoggerMeta = {
    name: string;
    tags: string[];
    level: LogLevel;
    guildId: string;
} & Record<string, any>;

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

        container.bind(ProxyLogger).to(ProxyLogger).inTransientScope();

        for (const [_, loggerMeta] of loggers) {
            const members = Object.values(loggerMeta.members);
            for (const member of members) {
                const data =
                    member.data as unknown as GuildLoggerDecoratorParams;
                const enabled = isEnabled(_disabledTags, data);
                const logger = fromSubContainer(
                    container,
                    ProxyLogger,
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
                container
                    .bind(Symbol.for(data.id))
                    .toConstantValue(logger)
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

export const withFileGuildLogging =
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

export const withJsonGuildLogging =
    (path: string, level: LogLevel, disabledTags?: string[]) =>
    (container: Container) => {
        container.bind(ILogSink).to(FileLogger).inSingletonScope();
        container.bind(FileLogger.Path).toConstantValue(path);
        container.bind(ILogRenderer).to(JsonLogLineRenderer).inSingletonScope();
        withGuildLogging(level, disabledTags)(container);
    };
