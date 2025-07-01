import { HadesClient, listener, listenFor, singleton } from "@hades-ts/core";
import { Events } from "discord.js";
import { inject } from "inversify";

@listener()
@singleton()
export class BotService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @listenFor(Events.ClientReady)
    async onReady(): Promise<void> {
        console.log("Dyskonos is ready!");
    }

    @listenFor(Events.Debug)
    async onDebug(message: string) {
        console.log(message);
    }
}
