import { Newable } from "@hades-ts/hades";
import { Collection } from "discord.js";

import { TextArgMeta } from "../../arguments";

/**
 * Decorator metadata for @command
 */
export class TextCommandMeta {
    name: string;
    target: Newable;
    args = new Collection<string, TextArgMeta>();
    description?: string;

    getArgMeta(name: string) {
        let meta = this.args.get(name);
        if (meta === undefined) {
            meta = new TextArgMeta();
            this.args.set(name, meta);
        }
        return meta;
    }

    addValidatorMethod(argName: string, methodName: string) {
        const arg = this.getArgMeta(argName);
        return arg.validatorMethods.add(methodName);
    }
}
