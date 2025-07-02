import {
    createClassCategoric,
    createMemberCategoric,
} from "@ldlework/categoric-decorators";
import {
    type Container,
    inject,
    type Newable,
    named,
    postConstruct,
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

export const logger =
    (name: string, ...tags: string[]) =>
    (target: any, field: string) => {
        const id = randomString();
        _logger({ target, field, name, tags, id })(target, field);
        inject(Symbol.for(id))(target, field);
        named(id)(target, field);
    };

export abstract class ILogger {
    abstract info(message: string): void;
    abstract warn(message: string): void;
    abstract error(message: string): void;
    abstract debug(message: string): void;
}

export class ProxyLogger implements ILogger {
    protected name!: string;
    protected tags!: string[];
    protected level!: LogLevel;

    @inject(ILogger)
    protected log!: ILogger;

    setName(name: string) {
        this.name = name;
    }
    setTags(tags: string[]) {
        this.tags = tags;
    }
    setLevel(level: LogLevel) {
        this.level = 99 as any; //level;
    }

    prefix(message: string) {
        return `[${this.name}] [${this.level}] ${message}`;
    }

    info(message: string) {
        if (this.level >= LogLevel.INFO) {
            this.log.info(this.prefix(message));
        }
    }
    warn(message: string) {
        if (this.level >= LogLevel.WARN) {
            this.log.warn(this.prefix(message));
        }
    }
    error(message: string) {
        if (this.level >= LogLevel.ERROR) {
            this.log.error(this.prefix(message));
        }
    }
    debug(message: string) {
        if (this.level >= LogLevel.DEBUG) {
            this.log.debug(this.prefix(message));
        }
    }
}

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
    debug(_message: string): void {
        return;
    }
}

export class ConsoleLogger implements ILogger {
    info(message: string) {
        console.log(message);
    }
    warn(message: string) {
        console.warn(message);
    }
    error(message: string) {
        console.error(message);
    }
    debug(message: string) {
        console.debug(message);
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

export const withLogging =
    (level: LogLevel, logClass: Newable<ILogger>, disabledTags?: string[]) =>
    (container: Container) => {
        const _disabledTags = disabledTags ?? [];
        container.bind(ILogger).to(logClass).inSingletonScope();
        container.bind(ProxyLogger).to(ProxyLogger).inTransientScope();
        const loggers = findLoggers();

        if (loggers.size === 0) {
            console.log("No loggers found");
            return;
        }

        for (const [_, loggerMeta] of loggers) {
            const members = Object.values(loggerMeta.members);
            for (const member of members) {
                const data = member.data as unknown as LoggerDecoratorParams;
                const enabled = isEnabled(_disabledTags, data);
                let logger: ILogger = new NullLogger();
                if (enabled) {
                    const _logger = container.get(ProxyLogger);
                    _logger.setName(data.name);
                    _logger.setTags(data.tags);
                    _logger.setLevel(level);
                    logger = _logger;
                }
                console.log(
                    `Binding logger ${data.id} to ${enabled ? "ProxyLogger" : "NullLogger"}`,
                );
                container
                    .bind(Symbol.for(data.id))
                    .toConstantValue(logger)
                    .whenNamed(data.id);
            }
        }
    };
