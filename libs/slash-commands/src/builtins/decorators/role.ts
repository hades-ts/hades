import { Constructable } from "@hades-ts/hades";
import { arg } from "./arg";


export type RoleArgOptions = {
    required?: boolean;
    description: string;
}

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function role(info: RoleArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            type: "ROLE",
            required: info.required,
            description: info.description,
        })(target, key);
    };
};