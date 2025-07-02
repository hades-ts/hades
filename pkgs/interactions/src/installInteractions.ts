import type { CategoricClassMeta } from "@ldlework/categoric-decorators";
import type {
    ApplicationCommandType,
    ComponentType,
    InteractionType,
} from "discord.js";
import type { Container, Newable } from "inversify";

import { findInteractions } from "./decorators";
import type { Interaction } from "./Interaction";
import { InteractionFactory } from "./InteractionFactory";
import { InteractionService } from "./InteractionService";

const groupMetasByInteractionAndSubType = (
    metas: CategoricClassMeta<{
        type: InteractionType;
        subType: ApplicationCommandType | ComponentType | undefined;
    }>[],
) => {
    const grouped = new Map<
        InteractionType,
        Map<
            ApplicationCommandType | ComponentType | undefined,
            Newable<Interaction>[]
        >
    >();
    for (const { data, target } of metas) {
        if (!grouped.has(data.type)) {
            grouped.set(data.type, new Map());
        }
        const subMap = grouped.get(data.type);
        if (!subMap?.has(data.subType)) {
            subMap?.set(data.subType, []);
        }
        const types = subMap?.get(data.subType);
        if (types) {
            types.push(target as Newable<Interaction>);
        }
    }
    return grouped;
};

const installCommandFactories = (
    container: Container,
    metas: CategoricClassMeta<{
        type: InteractionType;
        subType: ApplicationCommandType | ComponentType | undefined;
    }>[],
) => {
    const grouped = groupMetasByInteractionAndSubType(metas);
    for (const [interaction, subTypes] of grouped) {
        for (const [subType, types] of subTypes) {
            const factory = new InteractionFactory(
                container,
                interaction,
                subType ?? undefined,
                types,
            );
            container
                .bind<InteractionFactory>(InteractionFactory)
                .toConstantValue(factory);
        }
    }
};

/**
 * Binds InteractionFactory instances for each @interaction
 * @param container The Container to use.
 */
export const withInteractions = (container: Container) => {
    const metas = Array.from(findInteractions().values());
    installCommandFactories(container, metas);
    container.get(InteractionService);
};
