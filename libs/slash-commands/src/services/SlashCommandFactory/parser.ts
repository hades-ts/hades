import { Constructable, Constructor, Newable } from "@hades-ts/hades";
import { injectable } from "inversify";

import { getSlashArgMeta, registerSlashParser } from "../../metadata";
import { SlashArgParser } from "./SlashArgParser";

export interface ParserDecorator extends ClassDecorator, PropertyDecorator {}

/**
 * Sets the Parser to use for an argument.
 * @param parserClass The Parser to use.
 */
export function parser(parserClass?: Constructor<SlashArgParser>): ParserDecorator {
    return (target: Constructor, key?: any) => {
        if (key) {
            const constructable = target as Constructable;
            const argMeta = getSlashArgMeta(constructable.constructor, key);
            argMeta.parser = new parserClass();
        } else {
            const ctor = target as Constructor;
            if (!(ctor.prototype instanceof SlashArgParser)) {
                throw new Error(`@parser decorated class ${ctor.name} doesn't extend Parser.`);
            }
            registerSlashParser(ctor as Newable<SlashArgParser>);
            return injectable()(target);
        }
    };
}
