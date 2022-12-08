import { BaseCommandInteraction, Client } from "discord.js";
import { inject } from "inversify";
import { singleton } from "@hades-ts/hades";
import { SlashArgError } from "../../errors/SlashArgError";
import { SlashCommandContext } from "../../models/SlashCommandContext";
import { SlashCommandFactoryRegistry } from "../SlashCommandFactory/SlashCommandFactoryRegistry";
import { SlashParserService } from "./SlashParserService";
import { Command } from "../../builtins/Command";
import { getSlashArgMeta, getSlashCommandMetas } from "../../metadata/api";

@singleton(SlashCommandService)
export class SlashCommandService {
  /** service for parsing incoming interactions */
  @inject(SlashParserService)
  parserService: SlashParserService;

  /** factories for creating command instances */
  @inject(SlashCommandFactoryRegistry)
  factories: SlashCommandFactoryRegistry;

  // @inject(SlashCommandHelpService)
  // help: SlashCommandHelpService

  async execute(ctx: SlashCommandContext) {
    console.log("Executing command: " + ctx.command)
    const factory = this.factories.factoryFor(ctx.command);

    if (factory) {
      try {
        const command = await factory.create(ctx);
        await command.execute();
      } catch (e: unknown) {
        if (e instanceof SlashArgError) {
          if (e.showHelp) {
            ctx.interaction.reply({
              content: e.message,
            });
          } else {
            ctx.interaction.reply(e.message);
          }
        } else {
          ctx.interaction.reply(
            "Erm, uh well something went wrong. Dunno what though."
          );
          console.error(e);
        }
      }
    }
  }

  dispatch(interaction: BaseCommandInteraction) {
    const parsedMessage = this.parserService.parse(interaction);
    if (parsedMessage) {
      this.execute(parsedMessage);
    }
  }

  async registerCommands(client: Client) {
    console.log("Registering commands...?");
    const config = this.getCommandRegistrationMeta()
    console.log(JSON.stringify(config, null, 2))
    console.log('---')
    await client.application.commands.set(config);
  }

  protected getCommandRegistrationMeta(): Command[] {
    const commands = getSlashCommandMetas().map((meta) => {
      console.log(`Command: ${meta.name}`)
      return {
        ...meta.registrationDetails,
        options: meta.args.map((arg) => arg.options)
      }
    })
    return commands
  }
}
