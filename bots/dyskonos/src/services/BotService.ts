
import { singleton } from "@hades-ts/hades";
import { SlashCommandBotService } from "@hades-ts/slash-commands";

@singleton(BotService)
export class BotService extends SlashCommandBotService {}