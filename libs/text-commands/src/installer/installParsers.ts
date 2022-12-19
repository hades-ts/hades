import { Constructor } from "@hades-ts/hades";
import { Container } from "inversify";
import { getTextParserMetas, TextArgParser } from "../parsing";


/**
 * Binds all @parser classes.
 * @param container HadesContainer to use.
 */
export const installParsers = (container: Container) => {
    const parserMetas = getTextParserMetas();
    for (let meta of parserMetas) {
        container.bind(TextArgParser).to(meta.type as Constructor);
        container.bind(meta.type).to(meta.type as Constructor);
    }
}