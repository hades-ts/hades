import { type BaseInteraction, Events } from "discord.js";
import { Container, inject, injectable } from "inversify";

import { listener, listenFor, service } from "@hades-ts/core";
import { type ILogger, logger } from "@hades-ts/logging";

import type { InteractionFactory } from "./InteractionFactory";
import { InteractionFactoryRegistry } from "./InteractionFactoryRegistry";

@injectable()
export abstract class IInteractionDispatch {
    abstract dispatch(interaction: BaseInteraction): Promise<void>;
}

@injectable()
export class InteractionDispatch implements IInteractionDispatch {
    @inject(Container)
    protected container!: Container;

    @inject(InteractionFactoryRegistry)
    public factories!: InteractionFactoryRegistry;

    async dispatch(interaction: BaseInteraction) {
        return this.execute(this.container, interaction);
    }

    async execute(container: Container, interaction: BaseInteraction) {
        let factory: InteractionFactory | undefined;

        if (interaction.isCommand()) {
            factory = this.factories.factoryFor(
                interaction.type,
                interaction.commandType,
            );
        } else if (interaction.isMessageComponent()) {
            factory = this.factories.factoryFor(
                interaction.type,
                interaction.componentType,
            );
        } else {
            factory = this.factories.factoryFor(interaction.type, undefined);
        }

        if (factory) {
            try {
                const handlers = await factory.create(container, interaction);
                for (const handler of handlers) {
                    handler.execute(interaction);
                }
            } catch (e: unknown) {
                if (interaction.isRepliable()) {
                    await interaction.reply({
                        content:
                            "Erm, uh well something went wrong. Dunno what though.",
                        ephemeral: true,
                    });
                }
                console.error(e);
            }
        } else {
            console.error("No factory found for interaction", interaction.type);
        }
    }
}

@listener()
@service()
export class InteractionService {
    @inject(Container)
    protected container!: Container;

    @inject(IInteractionDispatch)
    protected dispatcher!: IInteractionDispatch;

    @listenFor(Events.InteractionCreate)
    onInteractionCreate(interaction: BaseInteraction) {
        return this.dispatch(interaction);
    }

    @logger("InteractionService")
    protected log!: ILogger;

    async dispatch(interaction: BaseInteraction) {
        this.log.debug("Dispatching interaction", {
            user: interaction.user.id,
            interactionId: interaction.id,
            interactionType: interaction.type,
        });
        await this.dispatcher.dispatch(interaction);
    }
}
