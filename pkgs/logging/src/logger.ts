import fs from "node:fs";

import {
    createMemberCategoric
} from "@ldlework/categoric-decorators";
import {
    Container,
    inject,
    named,
    type Newable
} from "inversify";

export type LoggerDecoratorParams = {
    target: any;
    field: string;
    name: string;
    tags: string[];
    id: string;
};

export const [_logger, findLoggers] =
    createMemberCategoric<LoggerDecoratorParams>();

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const randomString = () => {
    let result = "";
    for (let i = 0; i < 10; i++) {
        result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
};

export enum LogLevel {
    INFO = 0,
    WARN = 1,
    ERROR = 2,
    DEBUG = 3,
}

export const LogLevels = {
    [LogLevel.INFO]: "info",
    [LogLevel.WARN]: "warn",
    [LogLevel.ERROR]: "error",
    [LogLevel.DEBUG]: "debug",
};

export const logger =
    (name: string, ...tags: string[]) =>
    (target: any, field: string) => {
        const id = randomString();
        _logger({ target, field, name, tags, id })(target, field);
        inject(Symbol.for(id))(target, field);
        named(id)(target, field);
    };

export abstract class ILogger {
    abstract info(message: string, meta?: Record<string, any>): void;
    abstract warn(message: string, meta?: Record<string, any>): void;
    abstract error(message: string, meta?: Record<string, any>): void;
    abstract debug(message: string, meta?: Record<string, any>): void;
}

export abstract class ILogSink {
    abstract write(message: string, meta: LoggerMeta): void;
}

export type LoggerMeta = {
    name: string;
    tags: string[];
    level: LogLevel;
} & Record<string, any>;

export class ProxyLogger implements ILogger {
    protected name!: string;
    protected tags!: string[];
    protected level!: LogLevel;

    @inject(ILogSink)
    protected log!: ILogSink;

    setName(name: string) {
        this.name = name;
    }
    setTags(tags: string[]) {
        this.tags = tags;
    }
    setLevel(level: LogLevel) {
        this.level = level;
    }

    meta(level: LogLevel, meta?: Record<string, any>) {
        return {
            name: this.name,
            tags: this.tags,
            timestamp: new Date().toISOString(),
            level,
            ...meta,
        };
    }

    info(message: string, meta?: Record<string, any>) {
        if (this.level >= LogLevel.INFO) {
            this.log.write(message, this.meta(LogLevel.INFO, meta));
        }
    }
    warn(message: string, meta?: Record<string, any>) {
        if (this.level >= LogLevel.WARN) {
            this.log.write(message, this.meta(LogLevel.WARN, meta));
        }
    }
    error(message: string, meta?: Record<string, any>) {
        if (this.level >= LogLevel.ERROR) {
            this.log.write(message, this.meta(LogLevel.ERROR, meta));
        }
    }
    debug(message: string, meta?: Record<string, any>) {
        if (this.level >= LogLevel.DEBUG) {
            this.log.write(message, this.meta(LogLevel.DEBUG, meta));
        }
    }
}

export class NullLogger implements ILogSink {
    write(_message: string, _meta: LoggerMeta): void {
        return;
    }
}

export abstract class ILogRenderer {
    abstract render(message: string, meta: LoggerMeta): string;
}

export class PrefixLogLineRenderer implements ILogRenderer {
    render(message: string, meta: LoggerMeta): string {
        return `[${meta.name}] [${LogLevels[meta.level]}] ${message}\n`;
    }
}

export class JsonLogLineRenderer implements ILogRenderer {
    render(message: string, meta: LoggerMeta): string {
        return JSON.stringify({
            ...meta,
            message,
            level: LogLevels[meta.level],
        }) + "\n";
    }
}

export class ConsoleLogger implements ILogSink {
    @inject(ILogRenderer)
    protected renderer!: ILogRenderer;

    write(message: string, meta: LoggerMeta) {
        switch (meta.level) {
            case LogLevel.INFO:
                console.log(this.renderer.render(message, meta));
                break;
            case LogLevel.WARN:
                console.warn(this.renderer.render(message, meta));
                break;
            case LogLevel.ERROR:
                console.error(this.renderer.render(message, meta));
                break;
            case LogLevel.DEBUG:
                console.debug(this.renderer.render(message, meta));
                break;
        }
    }
}

export class FileLogger implements ILogSink {
    static Path = Symbol.for("FileLogger.Path");
    
    @inject(ILogRenderer)
    protected renderer!: ILogRenderer;

    @inject(FileLogger.Path)
    protected path!: string;

    write(message: string, meta: LoggerMeta) {
        const line = this.renderer.render(message, meta);
        const path = this.path;
        const file = fs.openSync(path, "a");
        fs.writeSync(file, line);
        fs.closeSync(file);
    }
}

const isEnabled = (disabledTags: string[], meta: LoggerDecoratorParams) => {
    if (disabledTags.includes(meta.name)) {
        return false;
    }
    for (const tag of meta.tags) {
        if (disabledTags.includes(tag)) {
            return false;
        }
    }
    return true;
};

const fromSubContainer = <T>(parent: Container, token: Newable<T>, installer: (subContainer: Container) => void) => {
    const subContainer = new Container({ parent })
    installer(subContainer)
    return subContainer.get(token)
}

export const withLogging =
    (level: LogLevel, disabledTags?: string[]) =>
    (container: Container) => {
        const _disabledTags = disabledTags ?? [];

        if (!container.isBound(ILogSink)) {
            throw new Error("ILogSink is not bound. Did you forget to bind it?");
        }

        const loggers = findLoggers();

        if (loggers.size === 0) {
            console.log("No use of @logger decorator found.");
            return;
        }

        container.bind(ProxyLogger).to(ProxyLogger).inTransientScope();

        for (const [_, loggerMeta] of loggers) {
            const members = Object.values(loggerMeta.members);
            for (const member of members) {
                const data = member.data as unknown as LoggerDecoratorParams;
                const enabled = isEnabled(_disabledTags, data);
                const logger = fromSubContainer(container, ProxyLogger, (subContainer) => {
                    if (!enabled) {
                        subContainer.bind(ILogSink).to(NullLogger).inSingletonScope();
                    }
                });
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

export const withConsoleLogging = (level: LogLevel, disabledTags?: string[]) =>
    (container: Container) => {
        container.bind(ILogSink).to(ConsoleLogger).inSingletonScope();
        container.bind(ILogRenderer).to(PrefixLogLineRenderer).inSingletonScope();
        withLogging(level, disabledTags)(container);
    }

export const withFileLogging = (path: string, level: LogLevel, disabledTags?: string[]) =>
    (container: Container) => {
        container.bind(ILogSink).to(FileLogger).inSingletonScope();
        container.bind(FileLogger.Path).toConstantValue(path);
        container.bind(ILogRenderer).to(PrefixLogLineRenderer).inSingletonScope();
        withLogging(level, disabledTags)(container);
    }

export const withJsonLogging = (path: string, level: LogLevel, disabledTags?: string[]) =>
    (container: Container) => {
        container.bind(ILogSink).to(FileLogger).inSingletonScope();
        container.bind(FileLogger.Path).toConstantValue(path);
        container.bind(ILogRenderer).to(JsonLogLineRenderer).inSingletonScope();
        withLogging(level, disabledTags)(container);
    }