import { HadesClient } from "@hades-ts/hades";
import { Channel, ChannelType, TextChannel } from "discord.js";
import { inject } from "inversify";
import { ConfigGuild } from "../../../config";
import { guildSingleton } from "../../decorators";
import { tokens } from "../../tokens";
import { DataService } from "./DataService";
import { CleanupBypass } from "./CleanupBypass";
import { WithRequired } from "../../../types";


@guildSingleton()
export class ChannelCleaner {

    @inject(HadesClient)
    private client!: HadesClient;

    @inject(tokens.GuildId)
    guildId!: string;

    @inject(tokens.GuildConfig)
    private config!: WithRequired<ConfigGuild, 'channel'>;

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
        
        const channel = await this.client.channels.fetch(this.config.channel.id);
        
        if (channel === null) {
            console.error(`[ChannelManager] Channel ${data.thread} does not exist for guild ${this.guildId}`);
            return;
        }

        if (!('messages' in channel)) {
            console.error(`[ChannelManager] Channel ${data.thread} is not a text channel for guild ${this.guildId}`);
            return;
        }

        if (!('bulkDelete' in channel)) {
            console.error(`[ChannelManager] Channel ${data.thread} does not support bulk deletion for guild ${this.guildId}`);
            return;
        }

        const messages = await channel.messages.fetch();
        
        await channel.bulkDelete(messages.filter(message => {
            if (message.id === data.thread) {
                return false;
            }

            if (message.pinned) {
                return false;
            }

            if (message.author.id === this.client.user?.id) {
                if (this.config.channel.singleMessage) {
                    return true;
                }
            } else if (this.config.channel.guard) {
                if (!this.bypass.isExempt(message.author.id)) {
                    return true;
                }
            }

            return false;
        }));
    }
}