import { HadesClient, HadesContainer, singleton } from "@hades-ts/hades";
import { TextChannel } from "discord.js";
import { Container, inject } from "inversify";
import { ConfigGuild } from "../config";
import { makeGuildContainer } from "./decorators";
import { GuildService } from "./GuildService";
import { tokens } from "./tokens";

@singleton(GuildManager)
export class GuildManager {
    protected guilds: Record<string, GuildService> = {};

    @inject(HadesContainer)    
    container!: HadesContainer;

    @inject(HadesClient)
    client!: HadesClient;

    async setupGuild(guildId: string) {
        const guildConfigs = this.container.get<Record<string, ConfigGuild>>('cfg.guilds');
        const guildConfig = guildConfigs[guildId];

        if (!guildConfig) {
            return null;
        }

        let channel: TextChannel;

        // check that the guildConfig.channel exists
        try {
            channel = await this.client.channels.fetch(guildConfig.channel) as TextChannel;
        } catch (e) {
            console.error(`[GuildManager] Channel ${guildConfig.channel} does not exist for guild ${guildId}`);
            return null;
        }

        const subContainer = makeGuildContainer(this.container);

        subContainer
            .bind(tokens.GuildId)
            .toConstantValue(guildId);

        subContainer
            .bind(tokens.GuildConfig)
            .toConstantValue(guildConfig);

        subContainer
            .bind(tokens.GuildOwner)
            .toConstantValue(channel.guild.ownerId);

        subContainer
            .bind(tokens.GuildFactory)
            .toConstantValue(async () => this.client.guilds.fetch(guildId));

        subContainer
            .bind(tokens.ChannelFactory)
            .toConstantValue(async () => this.client.channels.fetch(guildConfig.channel));

        this.guilds[guildId] = subContainer.get(GuildService);

        return this.guilds[guildId];
    }

    async getGuild(guildId: string) {
        return this.guilds[guildId] || (await this.setupGuild(guildId));
    }
    
}