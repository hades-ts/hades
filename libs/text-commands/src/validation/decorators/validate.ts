import { Constructable } from "@hades-ts/hades"

import { addTextValidatorMethod } from "../metadata"


/**
 * Marks method as validator for named argument.
 * @param name Name of argument to validate.
 */
export function validate(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return ({ constructor }: Constructable, key: string, _: PropertyDescriptor) => {
        addTextValidatorMethod(constructor, name, key)
    }
}
