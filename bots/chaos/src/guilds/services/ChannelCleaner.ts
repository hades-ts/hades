import { HadesClient } from "@hades-ts/hades";
import { TextChannel } from "discord.js";
import { inject } from "inversify";
import { ConfigGuild } from "../../config";
import { guildSingleton } from "../decorators";
import { tokens } from "../tokens";
import { DataService } from "./DataService";
import { CleanupBypass } from "./CleanupBypass";


@guildSingleton()
export class ChannelCleaner {

    @inject(tokens.GuildId)
    guildId!: string;

    @inject(tokens.GuildConfig)
    private config!: ConfigGuild;

    @inject(tokens.ChannelFactory)
    private getChannel!: () => Promise<TextChannel>;

    @inject(HadesClient)
    private client!: HadesClient;

    @inject(CleanupBypass)
    private bypass!: CleanupBypass;

    @inject(DataService)
    private dataService!: DataService;

    async cleanup() {
        console.log(`[ChannelManager] Deleting old messages for guild ${this.guildId}`);
        const data = this.dataService.getData();

        if (data === null) {
            return;
        }
        
        const channel = await this.getChannel();
        const messages = await channel.messages.fetch();
        
        await channel.bulkDelete(messages.filter(message => {
            if (message.id === data.thread) {
                return false;
            }

            if (message.pinned) {
                return false;
            }

            if (message.author.id === this.client.user?.id) {
                if (this.config.singleMessage) {
                    return true;
                }
            } else if (this.config.guardChannel) {
                if (!this.bypass.isExempt(message.author.id)) {
                    return true;
                }
            }

            return false;
        }));
    }
}