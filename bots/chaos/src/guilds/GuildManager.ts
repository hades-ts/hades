import { HadesClient, HadesContainer, singleton } from "@hades-ts/hades";
import { Container, inject } from "inversify";
import { makeGuildContainer } from "./decorators";
import { GuildService } from "./GuildService";
import { tokens } from "./tokens";

@singleton(GuildManager)
export class GuildManager {
    protected guilds: Record<string, GuildService> = {};

    @inject(HadesContainer)    
    container: HadesContainer;

    @inject(HadesClient)
    client: HadesClient;

    setupGuild(guildId: string) {
        const subContainer = makeGuildContainer(this.container);

        subContainer
            .bind(tokens.GuildId)
            .toConstantValue(guildId);

        this.guilds[guildId] = subContainer.get(GuildService);

        return this.guilds[guildId];
    }

    getGuild(guildId: string) {
        return this.guilds[guildId] || this.setupGuild(guildId);
    }
    
}