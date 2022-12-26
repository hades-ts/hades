import { Newable } from "@hades-ts/hades"

import { TextCommandMeta } from "../models"
import { getTextCommandMetas } from "./getTextCommandMetas"


/**
 * Get the command metdata for a particular class.
 * @param target Target class object.
 * @returns
 */
export function getTextCommandMeta(target: Newable) {
    const metas = getTextCommandMetas()
    let meta = metas.get(target)
    if (meta === undefined) {
        meta = new TextCommandMeta()
        meta.target = target
        metas.set(target, meta)
    }
    return meta
}