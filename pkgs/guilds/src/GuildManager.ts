import { HadesClient } from "@hades-ts/core";
import type { Guild } from "discord.js";
import { Container, inject, optional } from "inversify";

import { makeGuildContainer } from "./decorators";
import type { GuildBinder } from "./GuildBinder";
import { guildTokens } from "./tokens";

export type GuildFetcher = () => Promise<Guild>;

export class GuildInfo<T = unknown> {
    constructor(
        public readonly config: T | null,
        public readonly id: string,
        public readonly name: string,
        public readonly ownerId: string,
        public readonly fetch: GuildFetcher,
    ) {}
}

export class GuildManager {
    protected guildContainers: Record<string, Container> = {};

    @inject(Container)
    protected container!: Container;

    @inject("cfg.guilds")
    protected guilds!: Record<string, unknown>;

    @inject(HadesClient)
    protected client!: HadesClient;

    @optional()
    @inject(guildTokens.GuildBinder)
    protected guildBinder?: GuildBinder;

    protected async setupGuild(guild: Guild) {
        const subContainer: Container = makeGuildContainer(this.container);

        subContainer.bind(Container).toConstantValue(subContainer);

        const config = this.guilds[guild.id] || null;
        const info = new GuildInfo(
            config,
            guild.id,
            guild.name,
            guild.ownerId,
            async () => this.client.guilds.fetch(guild.id),
        );
        subContainer.bind(GuildInfo).toConstantValue(info);

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
