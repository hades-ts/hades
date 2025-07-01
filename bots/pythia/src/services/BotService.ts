import { HadesClient, listener, listenFor, singleton } from "@hades-ts/core";
import { GuildManager } from "@hades-ts/guilds";
import { Events } from "discord.js";
import { inject } from "inversify";
import { MentionHandler } from "../guildServices";
import { ThreadStarterService } from "./ThreadStarterService";

@listener()
@singleton()
export class BotService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(ThreadStarterService)
    protected threadStarter!: ThreadStarterService;

    @inject(GuildManager)
    protected guildManager!: GuildManager;

    @listenFor(Events.ClientReady)
    async onReady() {
        console.log(`Logged in as ${this.client.user?.username || "Unknown"}.`);
    }
}
