import { HadesClient, HadesContainer, singleton } from "@hades-ts/hades";
import { Guild } from "discord.js";
import { Container, inject, optional } from "inversify";
import { makeGuildContainer } from "./decorators";
import { GuildBinder } from "./GuildBinder";
import { tokens } from "./tokens";

export type GuildFetcher = () => Promise<Guild>;

@singleton(GuildManager)
export class GuildManager  {
    protected guildContainers: Record<string, Container> = {};

    @inject(HadesContainer)    
    container!: HadesContainer;

    @inject(HadesClient)
    client!: HadesClient;

    @optional()
    @inject(tokens.GuildBinder)
    guildBinder?: GuildBinder

    protected async setupGuild(guild: Guild) {
        const subContainer: Container = makeGuildContainer(this.container);

        subContainer
            .bind(tokens.GuildContainer)
            .toConstantValue(subContainer);

        subContainer
            .bind(tokens.GuildId)
            .toConstantValue(guild.id);

        subContainer
            .bind(tokens.GuildOwnerId)
            .toConstantValue(guild.ownerId);

        subContainer
            .bind(tokens.GuildFetcher)
            .toConstantValue(async () => this.client.guilds.fetch(guild.id));

        this.guildContainers[guild.id] = subContainer
        return subContainer;
    }

    async get(guild: Guild) {
        const cachedContainer = this.guildContainers[guild.id];

        if (cachedContainer) {
            return cachedContainer;
        }

        const newContainer = await this.setupGuild(guild);

        if (this.guildBinder) {
            this.guildBinder.bind(newContainer);
        }

        return newContainer;
    }
    
}