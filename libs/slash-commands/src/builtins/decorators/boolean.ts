import { Constructable } from "@hades-ts/hades";
import { arg } from "./arg";


type BooleanArgOptions = {
    required?: boolean;
    description: string;
}

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function boolean(info: BooleanArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            type: "BOOLEAN",
            description: info.description,
            required: info.required,
        })(target, key);
    };
};