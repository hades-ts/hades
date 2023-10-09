import { guildSingleton } from "@hades-ts/guilds";
import { CommandInteraction } from "discord.js";
import { inject, postConstruct } from "inversify";

import { ChannelWordAdder } from "./ChannelAdder";
import { ChannelCleaner } from "./ChannelCleaner";
import { DataService } from "./DataService";
import { MessageFilter } from "./MessageFilter";
import { MessageScheduler } from "./MessageScheduler";

@guildSingleton()
export class ChannelService {
    @inject(DataService)
    private dataService!: DataService;

    @inject(MessageScheduler)
    private scheduler!: MessageScheduler;

    @inject(ChannelCleaner)
    private cleaner!: ChannelCleaner;

    @inject(ChannelWordAdder)
    private adder!: ChannelWordAdder;

    @inject(MessageFilter)
    private filter!: MessageFilter;

    @postConstruct()
    protected init() {
        void this.startup();
    }

    protected async startup() {
        await this.cleaner.cleanup();
        await this.scheduler.checkRollover();
    }

    async rollover() {
        this.dataService.clearData();
        await this.scheduler.checkRollover();
    }

    async addWord(interaction: CommandInteraction, word: string) {
        await this.adder.addWord(interaction, word);
    }
}
