import { GuildMember } from "discord.js";
import { inject, postConstruct } from "inversify";
import { guildSingleton } from "../../decorators";
import { ChannelCleaner } from "./ChannelCleaner";
import { DataService } from "./DataService";
import { MessageFilter } from "./MessageFilter";
import { MessageScheduler } from "./MessageScheduler";
import { MessageUpdater } from "./MessageUpdater";

@guildSingleton()
export class ChannelService {

    @inject(DataService)
    private dataService!: DataService;

    @inject(MessageUpdater)
    private updater!: MessageUpdater;

    @inject(MessageScheduler)
    private scheduler!: MessageScheduler;

    @inject(ChannelCleaner)
    private cleaner!: ChannelCleaner;  

    @inject(MessageFilter)
    private filter!: MessageFilter;

    @postConstruct() 
    protected init () {
        this.startup();
    }

    protected async startup() {
        await this.cleaner.cleanup();
        await this.scheduler.checkRollover();
    }

    async rollover() {
        this.dataService.clearData();
        await this.scheduler.checkRollover();
    }

    async addWord(user: GuildMember, word: string) {
        return this.updater.addWord(user, word);
    }
}
    