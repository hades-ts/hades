import { Events } from "discord.js";
import { inject } from "inversify";

import { HadesClient, listener, listenFor, singleton } from "@hades-ts/core";

@listener()
@singleton()
export class BotService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @listenFor(Events.ClientReady)
    async onReady() {
        console.log(`Logged in as ${this.client.user?.username || "Unknown"}.`);
        this.client.guilds.cache.forEach((guild) => {
            console.log(` - ${guild.name} (${guild.id})`);
        });
    }
}
