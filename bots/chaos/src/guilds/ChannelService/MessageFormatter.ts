import { guildSingleton, guildTokens } from "@hades-ts/guilds"
import { inject } from "inversify"

import { GuildConfig } from "../../config"
import { WithRequired } from "../../types"
import { BaseMessageFormatter } from "../MessageFormatter"


@guildSingleton()
export class ChannelMessageFormatter extends BaseMessageFormatter {

    @inject(guildTokens.GuildConfig)
    protected config!: WithRequired<GuildConfig, 'channel'>

    protected async createMention() {
        let mention = undefined

        if (this.config.channel.mentionEveryone) {
            mention = `@everyone `
        } else if (this.config.channel.mentionRole) {
            mention = `<@&${this.config.channel.mentionRole}> `
        }

        return mention

    }

    protected async createContent(): Promise<string | undefined> {
        return await this.createMention()
    }

}
