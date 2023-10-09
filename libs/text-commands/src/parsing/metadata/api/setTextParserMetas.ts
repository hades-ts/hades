import { Collection } from "discord.js";

import { PARSER_METADATA } from "../consts";
import { TextArgParserMeta } from "../models";

/**
 * Update the set of @parser metas.
 * @param metas Collection of @parser metas.
 * @returns
 */
export function setTextParserMetas(metas: Collection<string, TextArgParserMeta>) {
    return Reflect.defineMetadata(PARSER_METADATA, metas, TextArgParserMeta);
}
