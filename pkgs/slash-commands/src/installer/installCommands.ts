import type { Container } from "inversify";

import { getSlashCommandMetas, type SlashCommandMeta } from "../metadata";
import { SlashCommandFactory, SlashCommandService } from "../services";

type Metas = ReturnType<typeof getSlashCommandMetas>;

const installCommandFactory = (
    container: Container,
    meta: SlashCommandMeta,
) => {
    const factory = new SlashCommandFactory(container, meta);
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
    const metas = getSlashCommandMetas();
    console.log("Commands:");
    for (const meta of metas) {
        console.log(meta);
    }
    installCommandFactories(container, metas);
    container.get(SlashCommandService);
};
