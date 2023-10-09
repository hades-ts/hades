import { createCategoricContainer } from "@ldlework/categoric-containers";

export const {
    makeChild: makeGuildContainer,
    singleton: guildSingleton,
    transient: guildTransient,
    request: guildRequest,
} = createCategoricContainer();
