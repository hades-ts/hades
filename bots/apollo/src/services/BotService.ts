import { inject } from 'inversify';
import { Interaction, Message } from 'discord.js';

import { singleton, DiscordService, HadesBotService } from "@hades-ts/hades";
import { TextCommandService } from '@hades-ts/text-commands';
import { SlashCommandService } from '@hades-ts/slash-commands';

@singleton(BotService)
export class BotService extends HadesBotService {

    @inject(DiscordService)
    discord: DiscordService;

    @inject(SlashCommandService)
    slashCommands: SlashCommandService;

    @inject(TextCommandService)
    textCommands: TextCommandService

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

        this.slashCommands.dispatch(interaction);
    }
}
