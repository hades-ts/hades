import {
    type AutocompleteInteraction,
    type BaseInteraction,
    type ChatInputApplicationCommandData,
    type ChatInputCommandInteraction,
    type CommandInteraction,
    Events,
} from "discord.js";
import { Container, inject } from "inversify";

import { HadesClient, listener, listenFor, singleton } from "@hades-ts/core";

import { SlashArgError } from "../../errors";
import { getSlashCommandMetas } from "../../metadata";
import { SlashCommandFactoryRegistry } from "../SlashCommandFactory";

@listener()
@singleton()
export class SlashCommandService {
    @inject(HadesClient)
    private readonly client!: HadesClient;

    @listenFor(Events.ClientReady)
    async onReady(): Promise<void> {
        this.registerCommands(this.client);
    }

    @listenFor(Events.InteractionCreate)
    async onInteractionCreate(interaction: BaseInteraction) {
        if (interaction.isCommand()) {
            await this.dispatch(interaction);
        }
    }

    @inject(Container)
    protected container!: Container;

    /** factories for creating command instances */
    @inject(SlashCommandFactoryRegistry)
    public factories!: SlashCommandFactoryRegistry;

    // @inject(SlashCommandHelpService)
    // help: SlashCommandHelpService

    async execute(interaction: ChatInputCommandInteraction) {
        const factory = this.factories.factoryFor(interaction.commandName);

        if (factory) {
            try {
                const command = await factory.create(interaction);
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

    async complete(interaction: AutocompleteInteraction) {
        const factory = this.factories.factoryFor(interaction.commandName);

        if (!factory) {
            return;
        }

        try {
            const choices = await factory.complete(interaction);
            await interaction.respond(choices);
        } catch (e) {
            console.error(e);
        }
    }

    dispatch(interaction: CommandInteraction) {
        if (interaction.isAutocomplete()) {
            return this.complete(interaction);
        }

        if (interaction.isCommand()) {
            return this.execute(interaction as ChatInputCommandInteraction);
        }

        return;
    }

    async registerCommands(client: HadesClient) {
        const config = this.getCommandRegistrationMeta();
        await client.application?.commands.set(config);
    }

    protected getCommandRegistrationMeta(): ChatInputApplicationCommandData[] {
        const commands = getSlashCommandMetas().map((meta) => {
            return {
                ...meta.registrationDetails,
                options: meta.args.map((arg) => {
                    if (arg.choicesResolver) {
                        const resolver = this.container.get(
                            arg.choicesResolver,
                            { autobind: true },
                        );
                        const choices = (resolver as any).getChoices();
                        arg.options = {
                            ...arg.options,
                            choices,
                        } as any;
                    } else if (arg.choicesCompleter) {
                        arg.options = {
                            ...arg.options,
                            autocomplete: true,
                        } as any;
                    }
                    return {
                        ...arg.options,
                    };
                }),
            };
        });
        // TODO: fix this
        return commands as unknown as ChatInputApplicationCommandData[];
    }
}
