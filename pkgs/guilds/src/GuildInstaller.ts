import type { Container } from "inversify";
import { GuildManager } from "./GuildManager";

export const withGuilds = () => {
    return (container: Container) => {
        container.bind(GuildManager).toSelf().inSingletonScope();
    };
};
