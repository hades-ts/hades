import { EventService, HadesClient } from "@hades-ts/hades";
import { inject } from "inversify";
import { guildRequest } from "./decorators"
import { ChannelManager, DataService } from "./services";
import { tokens } from "./tokens";


@guildRequest()
export class GuildService {

    @inject(tokens.GuildId)
    guildId: string;

    @inject(HadesClient)
    client: HadesClient;

    @inject(EventService)
    eventService: EventService;

    @inject(DataService)
    dataService: DataService;

    @inject(ChannelManager)
    channelManager: ChannelManager;  

    async addWord(userId: string, word: string) {
        await this.channelManager.addWord(userId, word);
    }

}