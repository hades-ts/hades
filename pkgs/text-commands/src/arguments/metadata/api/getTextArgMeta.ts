import { Newable } from "@hades-ts/hades";

import { getTextCommandMeta } from "../../../commands";

/**
 * Get the metadata for a particular argument.
 * @param target Target class object.
 * @param argName Target argument field name.
 * @returns
 */
export function getTextArgMeta(target: Newable, argName: string) {
    const meta = getTextCommandMeta(target);
    return meta.getArgMeta(argName);
}
