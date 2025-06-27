import { HadesClient, listener, listenFor, singleton } from "@hades-ts/core";
import { Events, type Message } from "discord.js";
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

    @listenFor(Events.MessageCreate)
    async onMessage(message: Message) {
        if (this.client.isHighlight(message.content)) {
            await message.reply("Hello!");
        }
    }

    @listenFor(Events.Debug)
    async onDebug(message: string) {
        console.log(message);
    }
}
