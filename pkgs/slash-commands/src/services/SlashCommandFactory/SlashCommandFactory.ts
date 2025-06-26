import {
    AutocompleteInteraction,
    type ChatInputCommandInteraction,
    Collection,
    type CommandInteraction,
} from "discord.js";
import { Container, type ServiceIdentifier } from "inversify";

import type { SlashCommandMeta } from "../../metadata";
import type { SlashCommand } from "../../models";
import { SlashArgInstaller } from "./SlashArgInstaller";

/**
 * Instantiates commands on invocation.
 *
 * Every command class is associated with its own SlashCommandFactory. On
 * invocation of that command, the factory will do what's necessary to
 * create an instance of that command class suitable for execution.
 */
export class SlashCommandFactory {
    /** container to derive sub-containers from */
    parentContainer: Container;
    /** the meta of the associated command */
    meta: SlashCommandMeta;

    /** arguments of the associated command */
    argInstallers = new Collection<string, SlashArgInstaller>();

    constructor(parentContainer: Container, meta: SlashCommandMeta) {
        this.parentContainer = parentContainer;
        this.meta = meta;
        // setup arguments
        for (const [argName, argMeta] of meta.args) {
            const arg = new SlashArgInstaller(argMeta);
            this.argInstallers.set(argName, arg);
        }
    }

    /**
     * Parse and install argument values into a container.
     * @param container Container to install into.
     * @param context The command invocation context.
     */
    async installArguments(
        container: Container,
        interaction: ChatInputCommandInteraction,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, arg] of this.argInstallers) {
            await arg.install(container, interaction);
        }
    }

    /**
     * Invoke validator methods on the given command instance.
     * @param inst Command instance.
     */
    async runMethodValidators(inst: any) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, arg] of this.argInstallers) {
            for (const methodName of arg.validatorMethods) {
                const callable = inst[methodName];
                if (callable) {
                    await callable.apply(inst);
                }
            }
        }
    }

    /**
     * Create a sub-container for resolving the command instance from.
     * @param context The parent container.
     * @returns A sub-container.
     */
    createSubContainer(interaction: CommandInteraction) {
        const di = new Container({ parent: this.parentContainer });

        // bind the command class
        di.bind(this.meta.target as ServiceIdentifier).toSelf();

        // bind the invocation context
        di.bind<CommandInteraction>("Interaction").toConstantValue(interaction);

        return di;
    }

    /**
     * Create an instance of the invoked command.
     * @param context A command invocation context.
     * @returns A command instance.
     */
    async create(interaction: ChatInputCommandInteraction) {
        // subcontainer config
        const subContainer = this.createSubContainer(interaction);

        // parse, validate and bind argument values
        await this.installArguments(subContainer, interaction);

        // resolve command instance
        const inst = subContainer.get<SlashCommand>(
            this.meta.target as ServiceIdentifier<SlashCommand>,
        );

        // run instance-method validators
        await this.runMethodValidators(inst);

        return inst;
    }

    async complete(interaction: AutocompleteInteraction) {
        const { name, value } = interaction.options.getFocused(true);
        const argMeta = this.meta.args.get(name);
        if (!argMeta) {
            return;
        }
        const di = new Container({ parent: this.parentContainer });
        di.bind(AutocompleteInteraction).toConstantValue(interaction);
        const completer = di.get(argMeta.choicesCompleter!, { autobind: true });
        const choices = await completer.complete(value);
        return choices;
    }
}
