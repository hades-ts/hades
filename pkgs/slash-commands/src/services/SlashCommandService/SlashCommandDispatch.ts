import type {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    CommandInteraction,
} from "discord.js";
import { Container, inject, injectable } from "inversify";

import { type ILogger, logger } from "@hades-ts/logging";

import { SlashArgError } from "../../errors";
import { SlashCommandFactoryRegistry } from "../SlashCommandFactory";
import type { ISlashCommandDispatch } from "./ISlashCommandDispatch";

@injectable()
export class SlashCommandDispatch implements ISlashCommandDispatch {
    @inject(Container)
    protected container!: Container;

    @inject(SlashCommandFactoryRegistry)
    public factories!: SlashCommandFactoryRegistry;

    @logger("SlashCommandDispatch")
    protected log!: ILogger;

    async dispatch(interaction: CommandInteraction): Promise<void> {
        return this.route(this.container, interaction);
    }

    async route(
        container: Container,
        interaction: CommandInteraction,
    ): Promise<void> {
        if (interaction.isChatInputCommand()) {
            return this.execute(
                container,
                interaction as ChatInputCommandInteraction,
            );
        } else if (interaction.isAutocomplete()) {
            return this.complete(
                container,
                interaction as AutocompleteInteraction,
            );
        }
    }

    async execute(
        container: Container,
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        const factory = this.factories.factoryFor(interaction.commandName);

        if (factory) {
            try {
                this.log.info(`Executing command.`, {
                    command: interaction.commandName,
                    guild: interaction.guild?.id,
                    user: interaction.user.id,
                });
                console.log(
                    `Executing command out of ${(this.container as any).type}`,
                );
                const command = await factory.create(container, interaction);
                this.log.info(`Command created.`, {
                    command: interaction.commandName,
                    guild: interaction.guild?.id,
                    user: interaction.user.id,
                });
                await command.execute();
            } catch (e: unknown) {
                if (e instanceof SlashArgError) {
                    if (e.showHelp) {
                        await interaction.reply({
                            content: e.message,
                            ephemeral: true,
                        });
                    } else {
                        await interaction.reply({
                            content: e.message,
                            ephemeral: true,
                        });
                    }
                } else {
                    this.log.error(`Error executing command.`, {
                        command: interaction.commandName,
                        guild: interaction.guild?.id,
                        user: interaction.user.id,
                    });
                    await interaction.reply({
                        content:
                            "Erm, uh well something went wrong. Dunno what though.",
                        ephemeral: true,
                    });
                    console.error(e);
                }
            }
        }
    }

    async complete(
        container: Container,
        interaction: AutocompleteInteraction,
    ): Promise<void> {
        const factory = this.factories.factoryFor(interaction.commandName);

        if (!factory) {
            return;
        }

        try {
            const choices = await factory.complete(container, interaction);
            await interaction.respond(choices);
        } catch (e) {
            console.error(e);
        }
    }
}
