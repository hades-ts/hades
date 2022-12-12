import { Constructable } from "@hades-ts/hades";
import { arg } from "./arg";


export type MemberArgOptions = {
    required?: boolean;
    description: string;
}

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function member(info: MemberArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            type: "USER",
            required: info.required,
            description: info.description,
        })(target, key);
    };
};