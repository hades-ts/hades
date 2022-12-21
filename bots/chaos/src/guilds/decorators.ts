import { createCategoricContainer } from "@ldlework/categoric-containers";

export const {
    makeChild: makeGuildContainer,
    singleton: guildSingleton,
    transient: guildTransient,
    request: guildRequest,
} = createCategoricContainer();

export const {
    makeChild: makeThreadContainer,
    singleton: threadSingleton,
    transient: threadTransient,
    request: threadRequest,
} = createCategoricContainer();