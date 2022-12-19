import { inject } from "inversify";
import { ApplicationCommandOptionType, GuildMember } from "discord.js";

import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand, arg, validate, SlashArgError } from "@hades-ts/slash-commands";
import { GuildManager } from "../guilds";
import { ConfigGuild } from "../config";



@command("chaos", { description: "Add a word to today's chaos message." })
export class ChaosCommand extends SlashCommand {

    @arg({ description: "Your word.", type: ApplicationCommandOptionType.String })
    word!: string;

    @inject('cfg.guilds')
    configGuilds!: Record<string, ConfigGuild>;

    @inject(HadesClient)
    client!: HadesClient;

    @inject(GuildManager)
    guildManager!: GuildManager;

    @validate("word")    
    protected validateWord() {
        if (this.word.split(/\s+/).length > 1) {
            throw new SlashArgError("Please only use one word.");
        }
    }

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

        const guild = await this.guildManager.getGuild(guildId);

        try {        
            await guild.addWord(this.interaction.member as GuildMember, this.word);
        } catch (error) {
            if (error instanceof Error) {
                await this.reject(error.message);
                return
            }
            await this.reject("Sorry, something went wrong. Try again later!");
            return
        }

        await this.interaction.reply({
            content: "Your word has been added. You can add a word again tomorrow.",
            ephemeral: true,
        })

    }

}