import { InstallerFunc, Newable } from "@hades-ts/hades"

import { getTextArgMeta } from "../../../arguments"


/**
 * Add an installer for a Validator for the given argument.
 * @param target Target class object.
 * @param argName Target argument field name.
 * @param installer Validator installer.
 */
export function addTextArgValidator(target: Newable, argName: string, installer: InstallerFunc) {
    const meta = getTextArgMeta(target, argName)
    meta.validatorInstallers.push(installer)
}