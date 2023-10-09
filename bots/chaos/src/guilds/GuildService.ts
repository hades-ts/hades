import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { inject } from "inversify";

import { GuildConfig } from "../config";
import { BanService } from "./BanService";
import { ChannelService } from "./ChannelService";
import { ThreadService } from "./ThreadService";

@guildSingleton()
export class GuildService {
    @inject(guildTokens.GuildId)
    public guildId!: string;

    @inject(guildTokens.GuildConfig)
    public guildConfig!: GuildConfig;

    @inject(ChannelService)
    public readonly channel!: ChannelService;

    @inject(ThreadService)
    public readonly threading!: ThreadService;

    @inject(BanService)
    public readonly bans!: BanService;
}
