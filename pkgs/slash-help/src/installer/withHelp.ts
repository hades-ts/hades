import type { Container } from "inversify";

import {
    getSlashCommandMetas,
    type SlashCommandMeta,
} from "@hades-ts/slash-commands";

import { SlashCommandHelper } from "../services";

type Metas = ReturnType<typeof getSlashCommandMetas>;

const installCommandHelper = (container: Container, meta: SlashCommandMeta) => {
    const helper = new SlashCommandHelper(meta);
    container.bind(SlashCommandHelper).toConstantValue(helper);
};

const installCommandHelpers = (container: Container, metas: Metas) => {
    metas.forEach((meta) => installCommandHelper(container, meta));
};

/**
 * Binds SlashCommandFactory instances for each @command
 * @param container The Container to use.
 */
export const withHelp = () => (container: Container) => {
    const metas = getSlashCommandMetas();
    installCommandHelpers(container, metas);
};
