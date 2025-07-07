import type {
    ApplicationCommandType,
    BaseInteraction,
    ComponentType,
    InteractionType,
} from "discord.js";
import type { Container, Newable } from "inversify";

import type { Interaction } from "./Interaction";

export class InteractionFactory {
    interaction: InteractionType;
    subType: ApplicationCommandType | ComponentType | undefined;
    classes: Newable<Interaction>[];

    constructor(
        interaction: InteractionType,
        subType: ApplicationCommandType | ComponentType | undefined,
        classes: Newable<Interaction>[],
    ) {
        this.interaction = interaction;
        this.subType = subType;
        this.classes = classes;
    }

    async create(container: Container, interaction: BaseInteraction) {
        return this.classes.map((cls) => {
            return container.get(cls, { autobind: true });
        });
    }
}
