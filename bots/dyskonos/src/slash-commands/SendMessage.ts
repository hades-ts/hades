import { command, SlashCommand, channel, arg } from "@hades-ts/slash-commands";
import { ApplicationCommandOptionType, Channel, GuildBasedChannel, TextChannel } from "discord.js";

@command("send-message", { description: "Send a message to a channel." })
export class SendMessageCommand extends SlashCommand {

    @channel({
        description: "The channel to send the message to.",
        required: true,
    })
    channel!: GuildBasedChannel;

    // @arg({
    //     type: ApplicationCommandOptionType.String,
    //     description: "The message to send.",
    //     required: true,
    // })
    // message!: string;

    async execute(): Promise<void> {
        if (this.channel.isSendable()) {
            await this.channel.send({
                content: "Hello, world!",
            });
        }
    }
}
