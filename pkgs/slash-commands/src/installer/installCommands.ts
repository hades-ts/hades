import type { Container } from "inversify";

import { getSlashCommandMetas, type SlashCommandMeta } from "../metadata";
import { SlashCommandFactory } from "../services";
import {
    ISlashCommandDispatch,
    SlashCommandDispatch,
} from "../services/SlashCommandService";

type Metas = ReturnType<typeof getSlashCommandMetas>;

const installCommandFactory = (
    container: Container,
    meta: SlashCommandMeta,
) => {
    const factory = new SlashCommandFactory(meta);
    container
        .bind<SlashCommandFactory>(SlashCommandFactory)
        .toConstantValue(factory);
};

const installCommandFactories = (container: Container, metas: Metas) => {
    metas.forEach((meta) => installCommandFactory(container, meta));
};

/**
 * Binds SlashCommandFactory instances for each @command
 * @param container The Container to use.
 */
export const installCommands = (container: Container) => {
    if (!container.isBound(ISlashCommandDispatch)) {
        container.bind(ISlashCommandDispatch).to(SlashCommandDispatch);
    }
    const metas = getSlashCommandMetas();
    installCommandFactories(container, metas);
};
