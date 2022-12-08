import { user, command, SlashCommand } from "@hades-ts/slash-commands";
import { GuildMember } from "discord.js";

const avatarEmbed = (member: GuildMember) => ({
    "embeds": [
        {
            "image": {
                "url": member.avatarURL(),
            }
        }
    ]
});

@command("hi", { description: "Say hi to the bot." })
export class HiCommand extends SlashCommand {

    @user({ description: "Who to say hi to." })
    who: GuildMember;

    async execute() {
        const reply = `Hi <@!${this.who.id}>!`
        const embed = avatarEmbed(this.who);
        return this.reply(reply, embed);
    }
}