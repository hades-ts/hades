import { PARSER_METADATA } from "../consts";
import { TextArgParserMeta } from "../models";
import { setTextParserMetas } from "./setTextParserMetas";


/**
 * Get all @parser metas.
 * @returns A Collection of all Parser metas.
 */
export function getTextParserMetas(): Set<TextArgParserMeta> {
    let metas = Reflect.getMetadata(PARSER_METADATA, TextArgParserMeta);
    if (metas === undefined) {
        metas = new Set<TextArgParserMeta>();
        setTextParserMetas(metas);
    }
    return metas;
}