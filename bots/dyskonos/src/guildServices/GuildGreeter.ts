import { HadesClient, listener, listenFor } from "@hades-ts/core";
import { guildService } from "@hades-ts/guilds";
import { Events, type Message } from "discord.js";
import { inject } from "inversify";

@listener()
@guildService()
export class GuildGreeter {
    @inject(HadesClient)
    private readonly client: HadesClient;

    @listenFor(Events.MessageCreate)
    async onMessageCreate(message: Message) {
        if (message.author.bot) return;
        if (this.client.isHighlight(message.content)) {
            await message.reply(`Hello from ${message.guild?.name}!`);
        }
    }
}
