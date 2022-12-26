import { HadesBotService } from "@hades-ts/hades"
import { Message } from "discord.js"
import { inject, injectable } from "inversify"

import { TextCommandHelpService } from "./TextCommandHelpService"
import { TextCommandService } from "./TextCommandService"


/**
 * A base bot class with text command support.
 */
@injectable()
export class TextCommandBotService extends HadesBotService {
    @inject(TextCommandService)
    protected commandService: TextCommandService

    @inject(TextCommandHelpService)
    protected helpService: TextCommandHelpService

    async onMessage<T extends Message>(message: T) {
        this.commandService.dispatch(message)
    }
}
