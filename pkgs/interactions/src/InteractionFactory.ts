import { GuildManager } from "@hades-ts/guilds";
import type {
    ApplicationCommandType,
    BaseInteraction,
    ComponentType,
    InteractionType,
} from "discord.js";
import { Container, type Newable } from "inversify";
import { Interaction } from "./Interaction";

export class InteractionFactory {
    interaction: InteractionType;
    subType: ApplicationCommandType | ComponentType | undefined;
    parentContainer: Container;
    classes: Newable<Interaction>[];

    constructor(
        parentContainer: Container,
        interaction: InteractionType,
        subType: ApplicationCommandType | ComponentType | undefined,
        classes: Newable<Interaction>[],
    ) {
        this.parentContainer = parentContainer;
        this.interaction = interaction;
        this.subType = subType;
        this.classes = classes;
    }

    async createSubContainer(interaction: BaseInteraction) {
        let parent = this.parentContainer;

        if (interaction.guild && parent.isBound(GuildManager)) {
            const guildManager = parent.get(GuildManager);
            const guildContainer = await guildManager.get(interaction.guild);
            parent = guildContainer;
        }

        const di = new Container({ parent });

        for (const cls of this.classes) {
            di.bind(Interaction).to(cls);
        }

        return di;
    }

    async create(interaction: BaseInteraction) {
        const subContainer = await this.createSubContainer(interaction);
        return subContainer.getAll(Interaction);
    }
}
