import { HadesClient } from "@hades-ts/core";
import { guildSingleton } from "@hades-ts/guilds";
import type { Message } from "discord.js";
import { inject } from "inversify";
import { MessageChainFormatter } from "./MessageChainFormatter";

@guildSingleton()
export class ShortContextService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(MessageChainFormatter)
    protected messageChainFormatter!: MessageChainFormatter;

    async fetchContext(message: Message, count: number) {
        const channel = message.channel;
        const messages = await channel.messages.fetch({
            before: message.id,
            limit: count,
        });
        return this.messageChainFormatter.formatMessageChain(
            Array.from(messages.values()),
        );
    }
}
