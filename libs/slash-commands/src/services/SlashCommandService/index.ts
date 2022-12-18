import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";
import { inject } from "inversify";
import { HadesContainer, singleton } from "@hades-ts/hades";

import { SlashArgError } from "../../errors";
import { SlashCommandFactoryRegistry } from "../SlashCommandFactory";
import { getSlashCommandMetas } from "../../metadata";
import { HadesClient } from "@hades-ts/hades";

@singleton(SlashCommandService)
export class SlashCommandService {

  @inject(HadesContainer)  
  container: HadesContainer;

  /** factories for creating command instances */
  @inject(SlashCommandFactoryRegistry)
  factories: SlashCommandFactoryRegistry;

  // @inject(SlashCommandHelpService)
  // help: SlashCommandHelpService

  async execute(interaction: CommandInteraction) {
    console.log("Executing command: " + interaction.commandName)
    const factory = this.factories.factoryFor(interaction.commandName);

    if (factory) {
      try {
        const command = await factory.create(interaction);
        await command.execute();
      } catch (e: unknown) {
        if (e instanceof SlashArgError) {
          if (e.showHelp) {
            interaction.reply({
              content: e.message,
              ephemeral: true,
            });
          } else {
            interaction.reply({
              content: e.message,
              ephemeral: true,
            });
          }
        } else {
          interaction.reply({
            content: "Erm, uh well something went wrong. Dunno what though.",
            ephemeral: true,
          });
          console.error(e);
        }
      }
    }
  }

  dispatch(interaction: CommandInteraction) {
    return this.execute(interaction);
  }

  async registerCommands(client: HadesClient) {
    const config = this.getCommandRegistrationMeta()
    console.log(JSON.stringify(config, null, 2))
    await client.application.commands.set(config);
  }

  protected getCommandRegistrationMeta(): ChatInputApplicationCommandData[] {
    const commands = getSlashCommandMetas().map((meta) => {
      return {
        ...meta.registrationDetails,
        options: meta.args.map((arg) => {
          if (arg.choicesResolver) {
            const resolver = this.container.resolve(arg.choicesResolver);
            (arg.options as any).choices = (resolver as any).getChoices();
          }
          return {
            ...arg.options,
          };
        })
      }
    })
    return commands
  }
}
