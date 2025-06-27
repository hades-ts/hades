import type { Constructable } from "@hades-ts/core";

import { addSlashValidatorMethod } from "../../metadata";

/**
 * Marks method as validator for named argument.
 * @param name Name of argument to validate.
 */
export function validate(name: string) {
    return (
        // biome-ignore lint/suspicious/noShadowRestrictedNames: ¯\_(ツ)_/¯
        { constructor }: Constructable,
        key: string,
        _: PropertyDescriptor,
    ) => {
        addSlashValidatorMethod(constructor, name, key);
    };
}
