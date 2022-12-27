import { guildSingleton } from "@hades-ts/guilds"
import { inject } from "inversify"

import { GuildConfig } from "../../config"
import { WithRequired } from "../../types"
import { BaseMessageFormatter } from "../MessageFormatter"


@guildSingleton()
export class ThreadMessageFormatter extends BaseMessageFormatter {

    @inject("wtf")
    protected config!: WithRequired<GuildConfig, 'threads'>

    protected async createFooter(): Promise<string> {
        return `Use /add-word <word> in the thread to add a word.`
    }

}
