import { inject } from "inversify"

import { guildSingleton } from "./decorators"
import { ChannelService } from "./services"
import { ThreadService } from "./services/ThreadService"


@guildSingleton()
export class GuildService {

    @inject(ChannelService)
    public readonly channel!: ChannelService

    @inject(ThreadService)
    public readonly threading!: ThreadService

}