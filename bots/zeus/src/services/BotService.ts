import { GuildManager } from "@hades-ts/guilds";
import { HadesClient, listener, singleton } from "@hades-ts/hades";
import { inject } from "inversify";

import { GuildService } from "../guildServices";

@listener()
@singleton()
export class BotService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(GuildManager)
    protected guildManager!: GuildManager;

    async onReady() {
        console.log(`Logged in as ${this.client.user?.username || "Unknown"}.`);
        const guilds = Array.from(this.client.guilds.cache.values());
        for (const guild of guilds) {
            console.log(` - ${guild.name} (${guild.id})`);
            // prewarm guild services
            const guildContainer = await this.guildManager.get(guild);
            guildContainer.get(GuildService);
        }
    }
}
