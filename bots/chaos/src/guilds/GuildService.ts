import { GuildMember } from "discord.js";
import { inject, postConstruct } from "inversify";
import { guildSingleton } from "./decorators"
import { ChannelCleaner, ChannelManager } from "./services";


@guildSingleton()
export class GuildService {

    @inject(ChannelManager)
    private channel!: ChannelManager;

    @inject(ChannelCleaner)
    private cleaner!: ChannelCleaner;

    @postConstruct() 
    protected init () {
        this.startup();
    }

    protected async startup() {
        await this.cleaner.cleanup();
        await this.channel.checkRollover();
    }    

    async addWord(user: GuildMember, word: string) {
        await this.channel.addWord(user, word);
    }

    async rollover() {
        await this.channel.rollover();
    }
}