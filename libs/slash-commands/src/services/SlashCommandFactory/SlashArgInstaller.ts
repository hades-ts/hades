import { Container } from 'inversify';

import { SlashArgError } from '../../errors';
import { SlashArgMeta } from '../../metadata';
import { SlashArgParser } from '../../parsers';
import { Constructor, Newable } from "@hades-ts/hades";
import { BaseCommandInteraction } from 'discord.js';

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
    /** the parser type used to get the value */
    parserType: Newable<SlashArgParser>;

    /** validator installers for this argument */
    // validatorInstallers: InstallerFunc[];
    /** methods for validating this argument's value */
    // validatorMethods: any;

    constructor(meta: SlashArgMeta, parser: SlashArgParser) {
        this.name = meta.name;
        this.type = meta.type;
        this.property = meta.property;
        this.description = meta.description;

        this.parser = parser;
        this.parserType = meta.parserType;

        // this.validatorMethods = meta.validatorMethods;
        // this.validatorInstallers = meta.validatorInstallers;
    }

    /**
     * Install the user's value for a given argument into the container.
     * @param di A container to bind the argument value in
     * @param context The context for the command invocation
     */
    async install(di: Container, interaction: BaseCommandInteraction) {
        // parse value
        const value = await this.parse(interaction);

        // install validators
        // this.installValidators(di);

        // resolve and run validators
        // await this.executeValidators(di, context, value);

        // finally bind the validated value in the subcontainer
        di.bind(this.property).toConstantValue(value)
    }

    private throwIfValueIsEmpty(value: any) {
        if (value === null || value === undefined) {
            throw new SlashArgError(`argument \`${this.name}\` must be a ${this.parser.name}.`, true);
        }
    }

    private async parse(interaction: BaseCommandInteraction) {
        const value = await this.parser.parse(this, interaction);
        this.throwIfValueIsEmpty(value);
        return value;
    }

    // private installValidators(di: Container) {
    //     for (let installer of this.validatorInstallers) {
    //         installer(di);
    //     }
    // }

    // private async executeValidators(di: Container, context: SlashCommandContext, value: any) {
    //     if (di.isBoundNamed(Validator, this.property)) {
    //         const validators = di.getAllNamed(Validator, this.property);
    //         for (let validator of validators) {
    //             await validator.validate(this, context, value);
    //         }
    //     }
    // }
}