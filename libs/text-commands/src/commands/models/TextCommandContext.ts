import { Message } from "discord.js"
import { MessageArgumentReader, SuccessfulParsedMessage } from "discord-command-parser"

/**
 * Carries information about a parsed command invocation.
 */
export class TextCommandContext {
    msg: Message
    body: string
    args: string[]
    reader: MessageArgumentReader
    success: boolean
    command: string

    constructor(msg: Message, parsed: SuccessfulParsedMessage<Message>) {
        this.msg = msg
        this.command = parsed.command
        this.body = parsed.body
        this.args = parsed.arguments
        this.reader = parsed.reader
        this.success = parsed.success
    }
}
