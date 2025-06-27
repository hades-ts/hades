import type { Constructable } from "@hades-ts/core";
import type {
    ApplicationCommandAutocompleteStringOption,
    ApplicationCommandChannelOptionData,
    ApplicationCommandChoicesData,
    ApplicationCommandNonOptionsData,
    ApplicationCommandNumericOptionData,
    ApplicationCommandOptionData,
    ApplicationCommandStringOptionData,
    ApplicationCommandSubCommandData,
    ApplicationCommandSubGroupData,
} from "discord.js";
import { type Container, inject, type Newable } from "inversify";

import { getSlashArgMeta } from "../../../metadata";
import type { SlashCommand } from "../../../models";
import type { SlashArgParser } from "../../../services";
import { camelToDash, type Optional } from "../../../utils";
import { whenTargetNamedConstraint } from "../../../utils/whenTargetNamed";
import { Validator } from "../../../validators";

export type ArgOptions =
    | Optional<ApplicationCommandSubGroupData, "name">
    | Optional<ApplicationCommandNonOptionsData, "name">
    | Optional<ApplicationCommandChannelOptionData, "name">
    | Optional<ApplicationCommandChoicesData, "name">
    | Optional<ApplicationCommandAutocompleteStringOption, "name">
    | Optional<ApplicationCommandNumericOptionData, "name">
    | Optional<ApplicationCommandStringOptionData, "name">
    | Optional<ApplicationCommandSubCommandData, "name">;

export type ArgConfig<TField = any> = {
    parser?: SlashArgParser;
    validators?: Array<Newable<Validator<TField>> | Validator<TField>>;
} & ArgOptions;

export const makeArgMeta = <TField>(
    info: ArgConfig<TField>,
    target: Constructable,
    key: string,
) => {
    const meta = getSlashArgMeta(target.constructor, key);
    meta.name = camelToDash(key);
    meta.options = {
        required: true,
        ...info,
        name: info.name || meta.name,
    } as ApplicationCommandOptionData;
    meta.property = key;
    meta.parser = info.parser!;
    meta.validatorInstallers =
        info.validators?.map(
            (validator: Validator<TField> | Newable<Validator<TField>>) =>
                (container: Container) => {
                    if (validator instanceof Validator) {
                        container
                            .bind(Validator)
                            .toConstantValue(validator)
                            .when(whenTargetNamedConstraint(key));
                    } else {
                        container
                            .bind(Validator)
                            .to(validator)
                            .when(whenTargetNamedConstraint(key));
                    }
                },
        ) || [];
    return meta;
};

/**
 * Marks the field of a SlashCommand as an argument.
 * @param info Options for the decorator.
 */
export function arg<TField = any>(info: ArgConfig<TField>) {
    return <T extends SlashCommand, K extends keyof T & string>(
        target: T,
        key: K,
    ): void => {
        // Now TypeScript will enforce T[K] extends TField
        const _typeCheck: T[K] extends TField ? true : never = true as any;

        makeArgMeta(info, target as any, key);
        inject(key)(target, key);
    };
}
