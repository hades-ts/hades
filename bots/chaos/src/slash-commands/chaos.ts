import { inject } from "inversify";
import { ApplicationCommandOptionType } from "discord.js";

import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand, arg, validate, SlashArgError } from "@hades-ts/slash-commands";
import { GuildManager } from "../guilds";



@command("chaos", { description: "Add a word to today's chaos message." })
export class ChaosCommand extends SlashCommand {

    @arg({ description: "Your word.", type: ApplicationCommandOptionType.String })
    word: string;

    @inject(HadesClient)
    client: HadesClient;

    @inject(GuildManager)
    guildManager: GuildManager;

    @validate("word")    
    protected validateWord() {
        if (this.word.split(/\s+/).length > 1) {
            throw new SlashArgError("Please only use one word.");
        }
    }

    protected async reject(content: string) {
        await this.interaction.deferReply({
            ephemeral: true,
        })
        await this.interaction.editReply({
            content,
        })
    }

    async execute(): Promise<void> {
        const guildId = this.interaction.guildId;
        const guild = this.guildManager.getGuild(guildId);

        if (!guild) {
            await this.reject("Sorry, I'm not set up for this guild yet. Try again later!");
            return;
        }

        try {        
            await guild.addWord(this.interaction.user.id, this.word);
        } catch (error) {
            if (error instanceof Error) {
                await this.reject(error.message);
            }
        }

        this.interaction.reply({
            content: "Your word has been added. You can add a word again tomorrow.",
            ephemeral: true,
        })
        // if (this.interaction.channel.type === ChannelType.GuildText) {
        //     return this.executeNewThread();
        // }

        // if (this.interaction.channel.type === ChannelType.PublicThread) {
        //     return this.executeExistingThread();
        // }
    }

    // async handleError(error: Error) {
    //     if (error instanceof GlobalQuotaError) {
    //         await this.reject(`Sorry, I'm out of tokens for the day. Ask again tomorrow!`);
    //         return
    //     }
    //     if (error instanceof UserQuotaError) {
    //         await this.reject(`Sorry, you're out of tokens for the day. Ask again tomorrow!`);
    //         return
    //     }
        
    //     await this.reject(`Sorry, I'm having trouble right now. Try again later!`);
    //     return        
    // }
}