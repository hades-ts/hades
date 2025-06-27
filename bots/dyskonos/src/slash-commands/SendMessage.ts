import {
    channel,
    command,
    guildCommand,
    SlashArgError,
    SlashCommand,
    text,
    Validator,
} from "@hades-ts/slash-commands";
import { ChannelType, type GuildBasedChannel } from "discord.js";
import { injectable, type Newable } from "inversify";
import { getMetadata, getOwnMetadata } from "reflect-metadata/no-conflict";

@injectable()
class MessageValidator extends Validator<string> {
    async validate(message: string) {
        if (message === "foobar") {
            throw new SlashArgError("You can't say that!!");
        }
    }
}

// @injectable()
// class MaxLengthValidator extends Validator<string> {
//     constructor(private readonly maxLength: number) {
//         super();
//     }

//     async validate(message: string) {
//         if (message.length > this.maxLength) {
//             throw new SlashArgError(
//                 `Message is too long! Max length is ${this.maxLength} characters.`,
//             );
//         }
//     }
// }

const makeValidator = <T extends Newable<Validator<any>>>(
    validatorClass: T,
): T => {
    injectable()(validatorClass) as T;
    return validatorClass;
};

const MaxLength = (maxLength: number) =>
    makeValidator(
        class MaxLengthValidator extends Validator<string> {
            async validate(message: string) {
                if (message.length > maxLength) {
                    throw new SlashArgError(
                        `Message is too long! Max length is ${maxLength} characters.`,
                    );
                }
            }
        },
    );

// @injectable()
// class NumberValidator extends Validator {
//     async validate(number: number) {
//         if (number === 1) {
//             throw new SlashArgError("You can't say that!!");
//         }
//     }
// }

@injectable()
class Sendable extends Validator {
    async validate(channel: GuildBasedChannel) {
        if (!channel.name.startsWith("sandbox")) {
            throw new SlashArgError(
                `You can't send messages to ${channel.name}`,
            );
        }
    }
}

@guildCommand("send-message", { description: "Send a message to a channel." })
export class SendMessageCommand extends SlashCommand {
    @channel({
        description: "The channel to send the message to.",
        validators: [Sendable],
        channelTypes: [ChannelType.GuildText],
    })
    channel!: GuildBasedChannel;

    @text({
        description: "The message to send.",
        validators: [MessageValidator, MaxLength(10), MaxLength(5)],
    })
    message!: string;

    async execute(): Promise<void> {
        if (this.channel.isSendable()) {
            await this.channel.send({
                content: this.message,
            });
            this.interaction.reply({
                content: "Message sent!",
                ephemeral: true,
            });
        }
    }
}
