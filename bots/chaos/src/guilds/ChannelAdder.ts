import { HadesClient, singleton } from "@hades-ts/hades";
import { CommandInteraction, GuildMember } from "discord.js";
import { inject } from "inversify";
import { ConfigGuild } from "../config";
import { GuildManager } from "./GuildManager";


@singleton(ChannelWordAdder)
export class ChannelWordAdder {
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
            throw new Error("Sorry, I'm not set up for this server yet. Try again later!");
        }

        if (guildConfig.disabled) {
            throw new Error("Sorry, I'm disabled in this server at the moment.");
        }

        if (!guildConfig.channel) {
            throw new Error("Sorry, I'm not set up for this server yet. Try again later!");
        }

        if (guildConfig.channel.id !== interaction.channelId) {
            throw new Error(`You can only use this in the <#${guildConfig.channel.id}> channel or in threads started with \`/create\`.`);
        }

        const guild = await this.guildManager.getGuild(guildId);

        await guild.channel.addWord(interaction.member as GuildMember, word);

        await interaction.reply({
            content: "Your word has been added. You can add a word again tomorrow.",
            ephemeral: true,
        })

    }
}
