import { HadesClient } from "@hades-ts/core";
import { guildSingleton } from "@hades-ts/guilds";
import type { CoreMessage } from "ai";
import type { Message } from "discord.js";
import { inject } from "inversify";

@guildSingleton()
export class MessageChainFormatter {
    @inject(HadesClient)
    protected client!: HadesClient;

    formatMessageChain(chain: Message[]) {
        return chain.map((m) => {
            if (m.author.id === this.client.user.id) {
                return {
                    role: "assistant",
                    content: m.content,
                };
            } else {
                return {
                    role: "user",
                    content: `${m.author.displayName} (${m.author.id}) says: ${m.content}`,
                };
            }
        }) as CoreMessage[];
    }
}
