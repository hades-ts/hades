import { Collection } from 'discord.js';
import { multiInject, postConstruct } from 'inversify';

import { singleton } from "@hades-ts/hades";
import { SlashCommandHelper } from './SlashCommandHelper';



/**
 * A registry of available command helpers.
 */
@singleton(SlashCommandHelperRegistry)
export class SlashCommandHelperRegistry {
    map = new Collection<string, SlashCommandHelper>();

    @multiInject(SlashCommandHelper)
    helpers: SlashCommandHelper[]

    @postConstruct()
    init() {
        for (const helper of this.helpers) {
            this.map.set(helper.name, helper);
        }
    }

    helperFor(name: string) {
        return this.map.get(name);
    }

    find(predicate: (helper: SlashCommandHelper) => boolean) {
        return this.helpers.find(predicate)
    }
}
