import { Client, GatewayIntentBits } from "discord.js";
import { injectable } from "inversify";
import { singleton } from "../decorators";

injectable()(Client);

/**
 * The base Discord client class.
 */
@singleton(HadesClient, false)
export class HadesClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.DirectMessages,
            ],
        });
    }
}
