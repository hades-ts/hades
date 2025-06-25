import { HadesBotService } from "@hades-ts/hades";
import {
    type BaseInteraction,
    type CacheType,
    ChatInputCommandInteraction,
    CommandInteraction,
    Interaction,
} from "discord.js";
import { inject, injectable } from "inversify";

import { SlashCommandService } from "./SlashCommandService";

@injectable()
export class SlashCommandBotService extends HadesBotService {
    @inject(SlashCommandService)
    protected commandService!: SlashCommandService;

    // @inject(SlashCommandHelpService)
    // helpService: SlashCommandHelpService

    override async onReady() {
        console.log("Executing onReady...");
        await this.commandService.registerCommands(this.client);
    }

    override async onInteractionCreate<T extends BaseInteraction<CacheType>>(
        interaction: T,
    ) {
        console.log("Executing onInteractionCreate...");

        if (!interaction.isCommand()) {
            return;
        }

        await this.commandService.dispatch(interaction);
    }
}
