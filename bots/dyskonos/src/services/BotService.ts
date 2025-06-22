
import { singleton } from "@hades-ts/hades";
import { SlashCommandBotService } from "@hades-ts/slash-commands";
import { inject, injectable } from "inversify";
import { ILogger } from "./logs/ILogger";
import { Message } from "discord.js";

export class BotService extends SlashCommandBotService {
    @inject(ILogger)
    private readonly logger: ILogger;

    async onReady(): Promise<void> {
        this.logger.info("Dyskonos is ready!");
        await super.onReady();
    }

    async onMessage(message: Message) {
        if (this.isHighlight(message.content)) {
            await message.reply('Hello!');
        }
    }
}