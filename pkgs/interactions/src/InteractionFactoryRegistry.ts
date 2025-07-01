import { singleton } from "@hades-ts/core";
import type {
    ApplicationCommandType,
    ComponentType,
    InteractionType,
} from "discord.js";
import { multiInject, postConstruct } from "inversify";
import { InteractionFactory } from "./InteractionFactory";

@singleton()
export class InteractionFactoryRegistry {
    map = new Map<
        InteractionType,
        Map<ApplicationCommandType | ComponentType | null, InteractionFactory>
    >();

    @multiInject(InteractionFactory)
    protected factories!: InteractionFactory[];

    @postConstruct()
    init() {
        for (const factory of this.factories) {
            if (!this.map.has(factory.interaction)) {
                this.map.set(factory.interaction, new Map());
            }
            const subTypeMap = this.map.get(factory.interaction);
            if (!subTypeMap?.has(factory.subType ?? null)) {
                subTypeMap?.set(factory.subType ?? null, factory);
            }
        }
    }

    factoryFor(
        interaction: InteractionType,
        subType: ApplicationCommandType | ComponentType | undefined,
    ) {
        const subTypeMap = this.map.get(interaction);

        if (!subTypeMap) {
            return;
        }

        return subTypeMap.get(subType ?? null);
    }

    all() {
        return this.factories;
    }
}
