import { createMemberCategoric } from "@ldlework/categoric-decorators";
import { inject, named } from "inversify";

import { randomString } from "./utils";

export type LoggerDecoratorParams = {
    target: any;
    field: string;
    name: string;
    tags: string[];
    id: string;
};

export const [_logger, _findLoggers] =
    createMemberCategoric<LoggerDecoratorParams>();

export const findLoggers = _findLoggers;

export const logger =
    (name: string, ...tags: string[]) =>
    (target: any, field: string) => {
        const id = randomString();
        _logger({ target, field, name, tags, id })(target, field);
        inject(Symbol.for(id))(target, field);
        named(id)(target, field);
    };
