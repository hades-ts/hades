import { type BaseInteraction, Events, InteractionType } from "discord.js";
import { Container, inject } from "inversify";

import { HadesClient, listener, listenFor, singleton } from "@hades-ts/core";

import type { InteractionFactory } from "./InteractionFactory";
import { InteractionFactoryRegistry } from "./InteractionFactoryRegistry";

@listener()
@singleton()
export class InteractionService {
    @inject(Container)
    protected container!: Container;

    /** factories for creating interaction instances */
    @inject(InteractionFactoryRegistry)
    public factories!: InteractionFactoryRegistry;

    @listenFor(Events.InteractionCreate)
    onInteractionCreate(interaction: BaseInteraction) {
        return this.dispatch(interaction);
    }

    async dispatch(interaction: BaseInteraction) {
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
                const handlers = await factory.create(interaction);
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
