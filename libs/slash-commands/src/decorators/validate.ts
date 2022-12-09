import { addSlashValidatorMethod } from "../metadata";
import { Constructable } from "@hades-ts/hades";


/**
 * Marks method as validator for named argument.
 * @param name Name of argument to validate.
 */
export function validate(name: string) {
    return ({ constructor }: Constructable, key: string, _: PropertyDescriptor) => {
        addSlashValidatorMethod(constructor, name, key);
    }
}
