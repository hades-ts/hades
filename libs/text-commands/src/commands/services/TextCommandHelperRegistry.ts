import { singleton } from "@hades-ts/hades";
import { Collection } from "discord.js";
import { multiInject, postConstruct } from "inversify";

import { TextCommandHelper } from "./TextCommandHelper";

/**
 * A registry of available command helpers.
 */
@singleton(TextCommandHelperRegistry)
export class TextCommandHelperRegistry {
    map = new Collection<string, TextCommandHelper>();

    @multiInject(TextCommandHelper)
    public helpers: TextCommandHelper[];

    @postConstruct()
    init() {
        for (const helper of this.helpers) {
            this.map.set(helper.name, helper);
        }
    }

    helperFor(name: string) {
        return this.map.get(name);
    }

    find(predicate: (helper: TextCommandHelper) => boolean) {
        return this.helpers.find(predicate);
    }
}
