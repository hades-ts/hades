import { createCategoricContainer } from "@ldlework/categoric-containers";
import { createClassCategoric } from "@ldlework/categoric-decorators";
import type { Newable } from "inversify";

export const {
    makeChild: makeGuildContainer,
    singleton: guildSingleton,
    transient: guildTransient,
    request: guildRequest,
} = createCategoricContainer();

export const [_guildService, findGuildServices] = createClassCategoric();

export const guildService = () => {
    return <T extends Newable>(target: T) => {
        guildSingleton()(target);
        _guildService()(target);
    };
};
