import { Newable } from "@hades-ts/hades";

import { TextArgParser } from "../../parsers";
import { TextArgParserMeta } from "../models";
import { getTextParserMetas } from "./getTextParserMetas";

/**
 * Register a class as a parser.
 * @param target Target parser class.
 */
export function registerTextParser(target: Newable<TextArgParser>) {
    const metas = getTextParserMetas();
    const meta = new TextArgParserMeta();
    meta.type = target;
    metas.add(meta);
}
