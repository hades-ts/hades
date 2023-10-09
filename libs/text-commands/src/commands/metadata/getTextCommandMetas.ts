import { Newable } from "@hades-ts/hades";
import { Collection } from "discord.js";

import { TextCommandMeta } from "../models";
import { COMMAND_METADATA } from "./consts";
import { setTextCommandMetas } from "./setTextCommandMetas";

/**
 * Get all metas defined with @command
 * @returns A collection of TextCommandMetas
 */
export function getTextCommandMetas(): Collection<Newable, TextCommandMeta> {
    let metas = Reflect.getMetadata(COMMAND_METADATA, TextCommandMeta);
    if (metas === undefined) {
        metas = new Collection<Newable, TextCommandMeta>();
        setTextCommandMetas(metas);
    }
    return metas;
}
