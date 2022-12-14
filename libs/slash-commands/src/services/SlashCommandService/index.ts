import { HadesClient, HadesContainer, singleton } from "@hades-ts/hades"
import {
    AutocompleteInteraction,
    BaseInteraction,
    ChatInputApplicationCommandData,
    CommandInteraction
} from "discord.js"
import { inject } from "inversify"

import { SlashArgError } from "../../errors"
import { getSlashCommandMetas } from "../../metadata"
import { SlashCommandFactoryRegistry } from "../SlashCommandFactory"


@singleton(SlashCommandService)
export class SlashCommandService {

    @inject(HadesContainer)
    protected container: HadesContainer

    /** factories for creating command instances */
    @inject(SlashCommandFactoryRegistry)
    public factories: SlashCommandFactoryRegistry

    // @inject(SlashCommandHelpService)
    // help: SlashCommandHelpService

    async execute(interaction: CommandInteraction) {
        console.log("Executing command: " + interaction.commandName)
        const factory = this.factories.factoryFor(interaction.commandName)

        if (factory) {
            try {
                const command = await factory.create(interaction)
                await command.execute()
            } catch (e: unknown) {
                if (e instanceof SlashArgError) {
                    if (e.showHelp) {
                        await interaction.reply({
                            content: e.message,
                            ephemeral: true,
                        })
                    } else {
                        await interaction.reply({
                            content: e.message,
                            ephemeral: true,
                        })
                    }
                } else {
                    await interaction.reply({
                        content: "Erm, uh well something went wrong. Dunno what though.",
                        ephemeral: true,
                    })
                    console.error(e)
                }
            }
        }
    }

    async complete(interaction: AutocompleteInteraction) {
        const factory = this.factories.factoryFor(interaction.commandName)

        if (!factory) {
            return
        }

        try {
            const choices = await factory.complete(interaction)
            await interaction.respond(choices)
        } catch (e) {
            console.error(e)
        }

    }

    dispatch(interaction: BaseInteraction) {
        if (interaction.isAutocomplete()) {
            return this.complete(interaction)
        }

        if (interaction.isCommand()) {
            return this.execute(interaction)
        }
    }

    async registerCommands(client: HadesClient) {
        const config = this.getCommandRegistrationMeta()
        console.log(JSON.stringify(config, null, 2))
        await client.application.commands.set(config)
    }

    protected getCommandRegistrationMeta(): ChatInputApplicationCommandData[] {
        const commands = getSlashCommandMetas().map((meta) => {
            return {
                ...meta.registrationDetails,
                options: meta.args.map((arg) => {
                    if (arg.choicesResolver) {
                        const resolver = this.container.resolve(arg.choicesResolver)
                        const choices = (resolver as any).getChoices()
                        arg.options = {
                            ...arg.options,
                            choices,
                        } as any
                    } else if (arg.choicesCompleter) {
                        arg.options = {
                            ...arg.options,
                            autocomplete: true,
                        } as any
                    }
                    return {
                        ...arg.options,
                    }
                })
            }
        })
        return commands
    }
}
