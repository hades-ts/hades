import { guildSingleton, guildTokens } from "@hades-ts/guilds"
import { inject } from "inversify"

import { GuildConfig } from "../config"
import { ChannelService } from "./ChannelService"
import { ThreadService } from "./ThreadService"



@guildSingleton()
export class GuildService {

    @inject(guildTokens.GuildId)
    public guildId!: string

    @inject("wtf")
    public guildConfig!: GuildConfig

    @inject(ChannelService)
    public readonly channel!: ChannelService

    @inject(ThreadService)
    public readonly threading!: ThreadService

}