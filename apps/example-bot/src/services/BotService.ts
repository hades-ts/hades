import { inject } from 'inversify';

import { singleton, DiscordService } from "@hades-ts/hades";
import { TextCommandBotService } from "@hades-ts/text-commands";

@singleton(BotService)
export class BotService extends TextCommandBotService {

    @inject(DiscordService)
    discord: DiscordService;

    async onReady() {
        const guilds = this.discord.guilds;
        console.log(`Logged in as ${this.client.user.username}.`);
        console.log(`-- in ${guilds.size} guilds`);
        for (const guild of guilds.values()) {
            console.log(`-- "${guild.name}" has ${Array.from(guilds.values())[0].memberCount} members.`)
        }
    }
}
