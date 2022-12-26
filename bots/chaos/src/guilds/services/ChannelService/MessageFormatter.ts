import { inject } from "inversify"

import { ConfigGuild } from "../../../config"
import { WithRequired } from "../../../types"
import { guildSingleton } from "../../decorators"
import { tokens } from "../../tokens"
import { BaseMessageFormatter } from "../MessageFormatter"


@guildSingleton()
export class ChannelMessageFormatter extends BaseMessageFormatter {

    @inject(tokens.GuildConfig)
    protected config!: WithRequired<ConfigGuild, 'channel'>

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
