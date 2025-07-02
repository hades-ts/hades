import { Client, GatewayIntentBits } from "discord.js";
import { injectable } from "inversify";

import { singleton } from "../decorators";

injectable()(Client);

/**
 * The base Discord client class.
 */
@singleton()
export class HadesClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.DirectMessages,
            ],
        });
    }

    public get highlight() {
        return `<@${this.user?.id}>`;
    }

    public isHighlight(content: string) {
        return content.startsWith(this.highlight);
    }
}
