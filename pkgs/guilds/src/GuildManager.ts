import { Events, type Guild } from "discord.js";
import {
    Container,
    inject,
    injectable,
    optional,
    type ServiceIdentifier,
} from "inversify";

import {
    HadesClient,
    listener,
    listenFor,
    service,
    singleton,
    withServices,
} from "@hades-ts/core";

import { findGuildServices, makeGuildContainer } from "./decorators";
import { findGuildListeners, GuildEventService } from "./events";
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

@listener()
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

    @listenFor(Events.ClientReady)
    async onClientReady() {
        console.log("GuildManager is ready");
        for (const guild of this.client.guilds.cache.values()) {
            const subContainer = await this.get(guild);

            const es = subContainer.get(GuildEventService);
            const listeners = findGuildListeners();

            for (const [_name, data] of listeners) {
                const listenerClass = data.target as any;
                subContainer.onActivation(
                    listenerClass,
                    (_context, instance) => {
                        es.register(instance as any);
                        return instance;
                    },
                );
            }

            for (const [type] of findGuildServices()) {
                subContainer.get(type as ServiceIdentifier<any>);
            }
        }
    }

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
