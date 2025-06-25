import { listenFor } from "@hades-ts/hades";
import { SlashCommandBotService } from "@hades-ts/slash-commands";
import { Events, type Message } from "discord.js";
import { inject } from "inversify";
import { ILogger } from "./logs/ILogger";

export class BotService extends SlashCommandBotService {
    @inject(ILogger)
    private readonly logger: ILogger;

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
}
