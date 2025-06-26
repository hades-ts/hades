import { listenFor, singleton } from "@hades-ts/hades";
import { SlashCommandBotService } from "@hades-ts/slash-commands";
import { Events, type Message } from "discord.js";
import { inject, postConstruct } from "inversify";
import { ILogger } from "./logs/ILogger";

@singleton(BotService)
export class BotService extends SlashCommandBotService {
    @inject(ILogger)
    private readonly logger: ILogger;

    @postConstruct()
    setup() {
        console.log("----- setup");
        console.log(`client is injected: ${this.client}`);
        this.eventService.register(this);
    }

    @listenFor(Events.ClientReady)
    override async onReady(): Promise<void> {
        this.logger.info("Dyskonos is ready!");
        await super.onReady();
    }

    @listenFor(Events.MessageCreate)
    async onMessage(message: Message) {
        if (this.isHighlight(message.content)) {
            await message.reply("Hello!");
        }
    }

    @listenFor(Events.Debug)
    async onDebug(message: string) {
        console.log(message);
    }
}
