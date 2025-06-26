import { type Constructor, type InstallerFunc, Newable } from "@hades-ts/hades";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import type { Container } from "inversify";

import { SlashArgError } from "../../errors";
import type { SlashArgMeta } from "../../metadata";
import { Validator } from "../../validators";
import type { SlashArgParser } from "./SlashArgParser";

/**
 * Binds argument values in a container.
 *
 * SlashArgInstaller is used by the SlashCommandFactory to inject the user-provided
 * value for a single command argument.
 */
export class SlashArgInstaller {
    /** the name of the argument */
    name: string;
    /** the command class */
    type: Constructor;
    /** the property to bind to */
    property: string;
    /** the argument's description */
    description: string;
    /** the parser instance used to get the value */
    parser: SlashArgParser;
    /** validator installers for this argument */
    validatorInstallers: InstallerFunc[];
    /** methods for validating this argument's value */
    validatorMethods: Set<string>;

    constructor(meta: SlashArgMeta) {
        this.name = meta.name;
        this.type = meta.type;
        this.property = meta.property;
        this.description = meta.description;
        this.parser = meta.parser;
        this.validatorMethods = meta.validatorMethods;
        this.validatorInstallers = meta.validatorInstallers;
    }

    /**
     * Install the user's value for a given argument into the container.
     * @param di A container to bind the argument value in
     * @param context The context for the command invocation
     */
    async install(di: Container, interaction: ChatInputCommandInteraction) {
        // parse value
        const value = await this.parse(interaction);

        // install validators
        console.log(`Installing validators for ${this.name}...`);
        this.installValidators(di);
        di.bind(SlashArgInstaller).toConstantValue(this);
        di.bind(ChatInputCommandInteraction).toConstantValue(interaction);
        // resolve and run validators
        console.log(`Executing validators for ${this.name}...`);
        await this.executeValidators(di, value);

        // finally bind the validated value in the subcontainer
        di.bind(this.property).toConstantValue(value);
    }

    private throwIfValueIsEmpty(value: any) {
        if (value === null || value === undefined) {
            throw new SlashArgError(
                `argument \`${this.name}\` must be a ${this.parser.name}.`,
                true,
            );
        }
    }

    private async parse(interaction: ChatInputCommandInteraction) {
        if (this.parser === undefined) {
            return interaction.options.getString(this.name);
        }

        const value = await this.parser.parse(this, interaction);
        this.throwIfValueIsEmpty(value);
        return value;
    }

    private installValidators(di: Container) {
        for (const installer of this.validatorInstallers) {
            installer(di);
        }
    }

    private async executeValidators(di: Container, value: any) {
        if (di.isBound(Validator, { name: this.property })) {
            const validators = di.getAll(Validator, { name: this.property });
            for (const validator of validators) {
                await validator.validate(value);
            }
        }
    }
}
