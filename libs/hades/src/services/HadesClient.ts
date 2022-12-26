import { Client } from "discord.js"
import { GatewayIntentBits } from "discord-api-types/v10"

import { singleton } from "../decorators"


/**
 * The base Discord client class.
 */
@singleton(HadesClient)
export class HadesClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.DirectMessages
            ]
        })
    }
}
