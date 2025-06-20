import { Container } from "inversify";

import { getSlashCommandMetas, SlashCommandMeta } from "../metadata";
import { SlashCommandFactory, SlashCommandHelper } from "../services";

type Metas = ReturnType<typeof getSlashCommandMetas>;

const installCommandFactory = (container: Container, meta: SlashCommandMeta) => {
    const factory = new SlashCommandFactory(container, meta);
    container.bind<SlashCommandFactory>(SlashCommandFactory).toConstantValue(factory);
};

const installCommandFactories = (container: Container, metas: Metas) => {
    metas.forEach((meta) => installCommandFactory(container, meta));
};

const installCommandHelper = (container: Container, meta: SlashCommandMeta) => {
    const helper = new SlashCommandHelper(meta);
    container.bind(SlashCommandHelper).toConstantValue(helper);
};

const installCommandHelpers = (container: Container, metas: Metas) => {
    metas.forEach((meta) => installCommandHelper(container, meta));
};

/**
 * Binds SlashCommandFactory instances for each @command
 * @param container The HadesContainer to use.
 */
export const installCommands = (container: Container) => {
    const metas = getSlashCommandMetas();
    console.log("Commands:");
    for (const meta of metas) {
        console.log(meta);
    }
    installCommandFactories(container, metas);
    installCommandHelpers(container, metas);
};
