import type { Container } from "inversify";

import { IInteractionDispatch } from "@hades-ts/interactions";
import { ISlashCommandDispatch } from "@hades-ts/slash-commands";

import { GuildInteractionDispatch } from "./GuildInteractionDispatch";
import { GuildManager } from "./GuildManager";
import { GuildSlashCommandDispatch } from "./GuildSlashCommandDispatch";
import { guildTokens } from "./tokens";

export const withGuilds = (
    ...installers: ((container: Container) => void)[]
) => {
    return (container: Container) => {
        container.bind(ISlashCommandDispatch).to(GuildSlashCommandDispatch);
        container.bind(IInteractionDispatch).to(GuildInteractionDispatch);
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
