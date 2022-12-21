import { HadesClient, singleton } from "@hades-ts/hades";
import { CommandInteraction, ChannelType, GuildMember } from "discord.js";
import { inject } from "inversify";
import { ConfigGuild } from "../config";
import { GuildManager } from "./GuildManager";


@singleton(ThreadWordAdder)
export class ThreadWordAdder {

    @inject('cfg.guilds')
    configGuilds!: Record<string, ConfigGuild>;

    @inject(HadesClient)
    client!: HadesClient;

    @inject(GuildManager)
    guildManager!: GuildManager;

    async execute(interaction: CommandInteraction, word: string) {
        const guildId = interaction.guildId!;

        const guildConfig = this.configGuilds[guildId];

        if (!guildConfig) {
            throw new Error("Sorry, I'm not set up for this guild yet. Try again later!");
        }

        if (guildConfig.disabled) {
            throw new Error("Sorry, I'm disabled in this server at the moment.");
        }

        if (!guildConfig.threads) {
            throw new Error("Sorry, I can't be used here.");
        }

        const channel = interaction.channel!;

        if (channel.type !== ChannelType.PublicThread) {
            throw new Error("Sorry, I can't be used here.");
        }

        const starter = await channel.fetchStarterMessage();

        if (!starter) {
            throw new Error("Something went wrong. Please try again later.");
        }

        if (starter.author.id !== this.client.user?.id) {
            throw new Error("You can only use this in threads I started.");
        }

        const guild = await this.guildManager.getGuild(guildId);

        await guild.threading.addWord(starter, interaction.member as GuildMember, word);        

        await interaction.reply({
            content: "Your word has been added!",
            ephemeral: true,
        })        
        
    }

}