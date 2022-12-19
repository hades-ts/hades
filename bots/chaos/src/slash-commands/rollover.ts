import { inject } from "inversify";
import { GuildMember } from "discord.js";

import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand } from "@hades-ts/slash-commands";
import { GuildManager } from "../guilds";
import { ConfigGuild } from "../config";



@command("rollover", { description: "Start a new chaos message." })
export class RolloverCommand extends SlashCommand {

    @inject('cfg.guilds')
    configGuilds!: Record<string, ConfigGuild>;

    @inject('cfg.botOwner')
    botOwner!: string;

    @inject(HadesClient)
    client!: HadesClient;

    @inject(GuildManager)
    guildManager!: GuildManager;

    protected async reject(content: string) {
        try {
            await this.interaction.deferReply({
                ephemeral: true,
            })
            await this.interaction.editReply({
                content,
            })
        } catch (error) {
            console.error(`Couldn't reply to user:`, error);
        }
    }

    async execute(): Promise<void> {
        const member = this.interaction.member as GuildMember;

        if (
            member.id !== this.interaction.guild!.ownerId &&
            member.id !== this.botOwner
        ) {
            await this.reject("Sorry, only an admin can do that.");
            return;
        }

        const guildId = this.interaction.guildId!;

        const guild = await this.guildManager.getGuild(guildId);

        const guildConfig = this.configGuilds[guildId];
        
        if (!guildConfig) {
            await this.reject("Sorry, I'm not set up for this guild yet. Try again later!");
            return;
        }

        if (guildConfig.disabled) {
            await this.reject("Sorry, I'm disabled in this server at the moment.");
            return;
        }

        try {        
            await guild.rollover();
        } catch (error) {
            if (error instanceof Error) {
                await this.reject(error.message);
                return
            }
            await this.reject("Sorry, something went wrong. Try again later!");
            return
        }

        await this.interaction.reply({
            content: "Done!",
            ephemeral: true,
        })

    }

}