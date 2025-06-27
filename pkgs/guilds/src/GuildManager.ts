import { HadesClient, singleton } from "@hades-ts/core";
import type { Guild } from "discord.js";
import { Container, inject, optional } from "inversify";

import { makeGuildContainer } from "./decorators";
import type { GuildBinder } from "./GuildBinder";
import { guildTokens } from "./tokens";

export type GuildFetcher = () => Promise<Guild>;

@singleton()
export class GuildManager {
    protected guildContainers: Record<string, Container> = {};

    @inject(Container)
    protected container!: Container;

    @inject(HadesClient)
    protected client!: HadesClient;

    @optional()
    @inject(guildTokens.GuildBinder)
    protected guildBinder?: GuildBinder;

    protected async setupGuild(guild: Guild) {
        const subContainer: Container = makeGuildContainer(this.container);

        subContainer
            .bind(guildTokens.GuildContainer)
            .toConstantValue(subContainer);

        subContainer.bind(guildTokens.GuildId).toConstantValue(guild.id);

        subContainer
            .bind(guildTokens.GuildOwnerId)
            .toConstantValue(guild.ownerId);

        subContainer
            .bind(guildTokens.GuildFetcher)
            .toConstantValue(async () => this.client.guilds.fetch(guild.id));

        this.guildContainers[guild.id] = subContainer;
        return subContainer;
    }

    async get(guild: Guild) {
        const cachedContainer = this.guildContainers[guild.id];

        if (cachedContainer) {
            return cachedContainer;
        }

        const newContainer = await this.setupGuild(guild);

        if (this.guildBinder) {
            await this.guildBinder.bind(newContainer);
        }

        return newContainer;
    }
}
