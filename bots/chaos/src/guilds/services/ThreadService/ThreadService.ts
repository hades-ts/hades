import { HadesClient } from "@hades-ts/hades";
import { GuildMember, Message, TextChannel } from "discord.js";
import { inject } from "inversify";
import { ConfigGuild } from "../../../config";
import { guildSingleton } from "../../decorators";
import { tokens } from "../../tokens";
import { ThreadQuotaService } from "./ThreadQuotaService";
import { ThreadDataService } from "./ThreadDataService";
import { ThreadMessageFormatter } from "./ThreadMessageFormatter";
import { ThreadWordValidator } from "./WordValidator";
import { ThreadMessageUpdater } from "./ThreadUpdater";



@guildSingleton()
export class ThreadService {

    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(tokens.GuildConfig)
    protected config!: ConfigGuild;

    @inject(ThreadQuotaService)
    quota!: ThreadQuotaService;

    @inject(ThreadMessageFormatter)
    private formatter!: ThreadMessageFormatter;

    @inject(ThreadDataService)
    private db!: ThreadDataService;

    @inject(ThreadMessageUpdater)
    private updater!: ThreadMessageUpdater;

    async validateCreation(memberId: string, channelId: string) {
        if (!this.config.threads) {
            throw new Error("Threads are not enabled for this guild.");
        }

        const threadConfig = this.config.threads!;

        const userQuota = await this.quota.userCanSpend(
            memberId,
            threadConfig.userPeriod || { days: 1 },
        );
        
        if (!userQuota) {
            throw new Error("You need to wait a bit before creating another thread.");
        }

        const channelQuota = await this.quota.channelCanSpend(
            channelId,
            threadConfig.channelPeriod || { days: 1 },
        );

        if (!channelQuota) {
            throw new Error("A thread was already recently created in this channel.");
        }        
    }    

    async createThread(message: Message) {
        await this.validateCreation(message.author.id, message.channelId);
        const messageContent = await this.formatter.create();
        await this.db.createThread(message.id);
        return messageContent;
    }   
    
    async addWord(thread: Message, member: GuildMember, word: string) {
        await this.updater.addWord(thread, member, word);
    }

}