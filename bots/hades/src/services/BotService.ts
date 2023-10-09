import { DiscordService, HadesBotService, singleton } from "@hades-ts/hades";
import { SlashCommandService } from "@hades-ts/slash-commands";
import { TextCommandService } from "@hades-ts/text-commands";
import { Interaction, Message } from "discord.js";
import { inject } from "inversify";

@singleton(BotService)
export class BotService extends HadesBotService {
    @inject(DiscordService)
    protected discord: DiscordService;

    @inject(SlashCommandService)
    protected slashCommands: SlashCommandService;

    @inject(TextCommandService)
    protected textCommands: TextCommandService;

    async onReady() {
        console.log(`Logged in as ${this.client.user.username}.`);
        await this.slashCommands.registerCommands(this.client);
    }

    async onMessage<T extends Message>(message: T) {
        this.textCommands.dispatch(message);
    }

    async onInteractionCreate<T extends Interaction>(interaction: T) {
        if (!interaction.isCommand()) {
            return;
        }

        await this.slashCommands.dispatch(interaction);
    }
}
