import { Constructor, Newable } from "@hades-ts/hades";
import { getTextArgMeta } from "../../../arguments";


/**
 * Add a method as a validator for an argument.
 * @param target Target class object.
 * @param argName Target argument field name.
 * @param methodName Validator method name.
 * @returns
 */
export function addTextValidatorMethod(target: Newable, argName: string, methodName: string) {
    const meta = getTextArgMeta(target, argName);
    return meta.validatorMethods.add(methodName);
}