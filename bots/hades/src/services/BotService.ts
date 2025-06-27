import { HadesClient, listener, listenFor, singleton } from "@hades-ts/hades";
import { Events } from "discord.js";
import { inject } from "inversify";

@listener()
@singleton()
export class BotService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @listenFor(Events.ClientReady)
    async onReady() {
        console.log(`Logged in as ${this.client.user.username}.`);
    }
}
