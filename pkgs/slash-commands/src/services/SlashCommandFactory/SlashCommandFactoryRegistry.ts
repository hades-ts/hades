import { singleton } from "@hades-ts/hades";
import { Collection } from "discord.js";
import { multiInject, postConstruct } from "inversify";

import { SlashCommandFactory } from "./SlashCommandFactory";

/**
 * A registry of available command factories.
 */
@singleton(SlashCommandFactoryRegistry)
export class SlashCommandFactoryRegistry {
    map = new Collection<string, SlashCommandFactory>();

    @multiInject(SlashCommandFactory)
    protected factories!: SlashCommandFactory[];

    @postConstruct()
    init() {
        for (const factory of this.factories) {
            this.map.set(factory.meta.name, factory);
        }
    }

    factoryFor(name: string) {
        return this.map.get(name);
    }

    find(predicate: (factory: SlashCommandFactory) => boolean) {
        return this.factories.find(predicate);
    }

    all() {
        return this.factories;
    }
}
