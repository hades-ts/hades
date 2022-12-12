import { CacheType, Interaction } from "discord.js";
import { inject, injectable } from "inversify";
import { HadesBotService } from "@hades-ts/hades";
import { SlashCommandService } from "./SlashCommandService";

@injectable()
export class SlashCommandBotService extends HadesBotService {
  @inject(SlashCommandService)
  commandService: SlashCommandService;

  // @inject(SlashCommandHelpService)
  // helpService: SlashCommandHelpService

  async onReady() {
    console.log("Executing onReady...");
    await this.commandService.registerCommands(this.client);
  }

  async onInteractionCreate<T extends Interaction<CacheType>>(interaction: T) {
    console.log("Executing onInteractionCreate...");

    if (!interaction.isCommand()) {
      return;
    }
    
    this.commandService.dispatch(interaction);
  }
}
