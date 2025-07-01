import { singleton } from "@hades-ts/core";
import type {
    ApplicationCommandType,
    ComponentType,
    Events,
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
        console.log("Initializing InteractionFactoryRegistry");
        for (const factory of this.factories) {
            if (!this.map.has(factory.interaction)) {
                this.map.set(factory.interaction, new Map());
            }
            const subTypeMap = this.map.get(factory.interaction);
            if (!subTypeMap?.has(factory.subType ?? null)) {
                console.log(
                    `Adding factory for interaction ${factory.interaction} with subType ${factory.subType}`,
                );
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
