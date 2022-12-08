import { inject } from 'inversify';

import { singleton, DiscordService } from "@hades-ts/hades";
import { SlashCommandBotService } from "@hades-ts/slash-commands";
// import { TextCommandBotService } from "@hades-ts/text-commands";

@singleton(BotService)
export class BotService extends SlashCommandBotService {

    @inject(DiscordService)
    discord: DiscordService;

    async onReady() {
        const guilds = this.discord.guilds;
        console.log(`Logged in as ${this.client.user.username}.`);
        console.log(`-- in ${guilds.size} guilds`);
        for (const guild of guilds.values()) {
            console.log(`-- "${guild.name}" has ${Array.from(guilds.values())[0].memberCount} members.`)
        }

        await super.onReady()
    }
}
