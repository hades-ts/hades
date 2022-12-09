import { BaseCommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";
import { inject } from "inversify";
import { singleton } from "@hades-ts/hades";
import { SlashArgError } from "../../errors/SlashArgError";
import { SlashCommandFactoryRegistry } from "../SlashCommandFactory/SlashCommandFactoryRegistry";
import { getSlashCommandMetas } from "../../metadata/api";

@singleton(SlashCommandService)
export class SlashCommandService {
  /** factories for creating command instances */
  @inject(SlashCommandFactoryRegistry)
  factories: SlashCommandFactoryRegistry;

  // @inject(SlashCommandHelpService)
  // help: SlashCommandHelpService

  async execute(interaction: BaseCommandInteraction) {
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
            });
          } else {
            interaction.reply(e.message);
          }
        } else {
          interaction.reply(
            "Erm, uh well something went wrong. Dunno what though."
          );
          console.error(e);
        }
      }
    }
  }

  dispatch(interaction: BaseCommandInteraction) {
    return this.execute(interaction);
  }

  async registerCommands(client: Client) {
    const config = this.getCommandRegistrationMeta()
    await client.application.commands.set(config);
  }

  protected getCommandRegistrationMeta(): ChatInputApplicationCommandData[] {
    const commands = getSlashCommandMetas().map((meta) => {
      return {
        ...meta.registrationDetails,
        options: meta.args.map((arg) => arg.options)
      }
    })
    return commands
  }
}
