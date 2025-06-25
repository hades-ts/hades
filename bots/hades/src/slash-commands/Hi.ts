import { HadesClient } from "@hades-ts/hades";
import { command, SlashArgError, SlashCommand, user, validate } from "@hades-ts/slash-commands";
import { EmbedBuilder, type GuildMember } from "discord.js";
import { inject } from "inversify";

const avatarEmbed = (member: GuildMember) => ({
    embeds: [new EmbedBuilder().setDescription(`Avatar of <@!${member.id}>`).setImage(member.user.displayAvatarURL())],
});

@command("hi", { description: "Say hi to the bot." })
export class HiCommand extends SlashCommand {
    @inject(HadesClient)
    protected client: HadesClient;

    @user({ description: "Who to say hi to." })
    who: GuildMember;

    @validate("who")
    async validateWho() {
        if (this.who.id === this.client.user.id) {
            throw new SlashArgError("I'm not gonna greet myself lol.");
        }
    }

    async execute() {
        const reply = `Hi <@!${this.who.id}>!`;
        const embed = avatarEmbed(this.who);
        await this.reply(reply, embed);
    }
}
