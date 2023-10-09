import { HadesClient } from "@hades-ts/hades";
import { user, command, validate, SlashCommand, SlashArgError } from "@hades-ts/slash-commands";
import { GuildMember, EmbedBuilder } from "discord.js";
import { inject } from "inversify";

const avatarEmbed = (member: GuildMember) => ({
    embeds: [
        new EmbedBuilder().setDescription(`ti kibyka'i la'o <@!${member.id}>`).setImage(member.user.displayAvatarURL()),
    ],
});

@command("coi", { description: "rinsa zo'e" })
export class HiCommand extends SlashCommand {
    @inject(HadesClient)
    client: HadesClient;

    @user({ description: "se rinsa" })
    who: GuildMember;

    @validate("who")
    async validateWho() {
        if (this.who.id === this.client.user.id) {
            throw new SlashArgError("u'i mi ri na rinsa");
        }
    }

    async execute() {
        const reply = `coi la'o <@!${this.who.id}>`;
        const embed = avatarEmbed(this.who);
        await this.reply(reply, embed);
    }
}
