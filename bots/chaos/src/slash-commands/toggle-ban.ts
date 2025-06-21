import { arg, command, SlashCommand } from "@hades-ts/slash-commands";
import { ApplicationCommandOptionType, GuildMember } from "discord.js";
import { inject } from "inversify";

import { GuildConfig } from "../config";
import { GuildServiceFactory } from "../services";

@command("ban-user", { description: "Toggle whether a user can use Chaos." })
export class UserBanCommand extends SlashCommand {
    @arg({ description: "User", type: ApplicationCommandOptionType.User })
    user!: GuildMember;

    @inject("cfg.guilds")
    private configGuilds!: Record<string, GuildConfig>;

    @inject(GuildServiceFactory)
    private guildServiceFactory!: GuildServiceFactory;

    protected async reject(content: string) {
        try {
            await this.interaction.deferReply({
                ephemeral: true,
            });
            await this.interaction.editReply({
                content,
            });
        } catch (error) {
            console.error(`Couldn't reply to user:`, error);
        }
    }

    async execute(): Promise<void> {
        const guildId = this.interaction.guildId!;
        const guildConfig = this.configGuilds[guildId];

        if (!guildConfig) {
            await this.reject("Sorry, I'm not set up for this guild yet. Try again later!");
            return;
        }

        if (guildConfig.disabled) {
            await this.reject("Sorry, I'm disabled in this server at the moment.");
            return;
        }

        const guildService = await this.guildServiceFactory.getGuildService(this.interaction.guild!);
        const tag = guildService.bans.db.getTag(this.user.id, "banned");

        if (tag) {
            guildService.bans.db.removeTag(this.user.id, "banned");
            await this.reply(`User <@${this.user.id}> has been unbanned.`, {
                ephemeral: true,
            });
        } else {
            guildService.bans.db.addTag(this.user.id, "banned");
            await this.reply(`User <@${this.user.id}> has been banned.`, {
                ephemeral: true,
            });
        }
    }
}
