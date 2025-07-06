import type { Container } from "inversify";

import { IEventService } from "@hades-ts/core";

import { GuildEventService } from "./events";
import { GuildManager } from "./GuildManager";
import { guildTokens } from "./tokens";

export const withGuilds = (
    ...installers: ((guildContainer: Container) => void)[]
) => {
    return (container: Container) => {
        container.bind(IEventService).to(GuildEventService).inSingletonScope();
        container.bind(GuildManager).toSelf().inSingletonScope();
        if (installers.length > 0) {
            container
                .bind(guildTokens.GuildBinder)
                .toConstantValue((c: Container) => {
                    for (const installer of installers) {
                        installer(c);
                    }
                });
        }
    };
};
