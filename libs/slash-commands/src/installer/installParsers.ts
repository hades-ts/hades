import { Constructor, Newable } from "@hades-ts/hades";
import { Container } from "inversify";
import { getSlashParserMetas } from "../metadata";
import { SlashArgParser } from "../services";


/**
 * Binds all @parser classes.
 * @param container HadesContainer to use.
 */
export const installParsers = (container: Container) => {
    const parserMetas = getSlashParserMetas();
    for (let meta of parserMetas) {
        container.bind(SlashArgParser).to(meta.type as Constructor);
        container.bind(meta.type).to(meta.type as Constructor);
    }
}