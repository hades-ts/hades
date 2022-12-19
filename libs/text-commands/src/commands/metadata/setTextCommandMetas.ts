import { Newable } from "@hades-ts/hades";
import { Collection } from "discord.js";
import { COMMAND_METADATA } from "./consts";
import { TextCommandMeta } from "../models";


/**
 * Updates the set of @command metas.
 * @param metas All TextCommandMeta objects.
 * @returns
 */
export function setTextCommandMetas(metas: Collection<Newable, TextCommandMeta>) {
    return Reflect.defineMetadata(COMMAND_METADATA, metas, TextCommandMeta);
}