import { Collection } from 'discord.js';
import { multiInject, postConstruct } from 'inversify';

import { Constructor, Newable, singleton } from "@hades-ts/hades";

import { SlashArgParser } from './SlashArgParser';
import { StringParser } from './String';


export type TypeMap = [Constructor, Newable<SlashArgParser>];


/**
 * Decides which parser to use for a given argument type.
 */
@singleton(SlashArgParserResolver)
export class SlashArgParserResolver {
    @multiInject('SlashMappedTypes')
    protected types: TypeMap[]

    private map = new Collection<Constructor, Newable<SlashArgParser>>();

    @postConstruct()
    init() {
        this.types.forEach(([from, to]) => this.map.set(from, to))
    }

    /**
     * Get a parser type for a given argument type.
     * @param fromType The argument type to look up.
     * @returns 
     */
    infer(fromType: Constructor) {
        if (!fromType) {
            return StringParser;
        }
        for (let [ctor, type] of this.map) {
            if (ctor.name === fromType.toString()) {
                return type;
            }
        }
    }
}
