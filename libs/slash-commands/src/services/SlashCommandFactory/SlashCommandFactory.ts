import { AutocompleteInteraction, Collection, CommandInteraction } from "discord.js"
import { Container, interfaces } from "inversify"

import { SlashCommandMeta } from "../../metadata"
import { SlashCommand } from "../../models"
import { SlashArgInstaller } from "./SlashArgInstaller"
import { SlashArgParserRegistry } from "./SlashArgParserRegistry"
import { SlashArgParserResolver } from "./SlashArgParserResolver"

/**
 * Instantiates commands on invocation.
 *
 * Every command class is associated with its own SlashCommandFactory. On
 * invocation of that command, the factory will do what's necessary to
 * create an instance of that command class suitable for execution.
 */
export class SlashCommandFactory {
    /** container to derive sub-containers from */
    parentContainer: Container
    /** the meta of the associated command */
    meta: SlashCommandMeta

    /** service for looking up parsers based on argument type */
    inferenceService: SlashArgParserResolver
    /** service for easy lookup of parsers */
    parserService: SlashArgParserRegistry
    /** arguments of the associated command */
    argInstallers = new Collection<string, SlashArgInstaller>()

    constructor(parentContainer: Container, meta: SlashCommandMeta) {
        this.parentContainer = parentContainer
        this.meta = meta

        this.inferenceService = parentContainer.get(SlashArgParserResolver)
        this.parserService = parentContainer.get(SlashArgParserRegistry)
        // setup arguments
        for (const [argName, argMeta] of meta.args) {
            const parserType =
                argMeta.parserType || this.inferenceService.infer(argMeta.type)
            const parser = this.parserService.parserFor(parserType)
            const arg = new SlashArgInstaller(argMeta, parser)
            this.argInstallers.set(argName, arg)
        }
    }

    /**
   * Parse and install argument values into a container.
   * @param container Container to install into.
   * @param context The command invocation context.
   */
    async installArguments(container: Container, interaction: CommandInteraction) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, arg] of this.argInstallers) {
            await arg.install(container, interaction)
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
                const callable = inst[methodName]
                if (callable) {
                    await callable.apply(inst)
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
        const di = this.parentContainer.createChild({ skipBaseClassChecks: true })

        // bind the command class
        di.bind(this.meta.target as interfaces.ServiceIdentifier).toSelf()

        // bind the invocation context
        di
            .bind<CommandInteraction>("Interaction")
            .toConstantValue(interaction)

        // connect the containers
        di.parent = this.parentContainer
        return di
    }

    /**
   * Create an instance of the invoked command.
   * @param context A command invocation context.
   * @returns A command instance.
   */
    async create(interaction: CommandInteraction) {
        // subcontainer config
        const subContainer = this.createSubContainer(interaction)

        // parse, validate and bind argument values
        await this.installArguments(subContainer, interaction)

        // resolve command instance
        const inst = subContainer.get<SlashCommand>(this.meta.target as interfaces.ServiceIdentifier<SlashCommand>)

        // run instance-method validators
        await this.runMethodValidators(inst)

        return inst
    }

    async complete(interaction: AutocompleteInteraction) {
        const { name, value } = interaction.options.getFocused(true)
        const argMeta = this.meta.args.get(name)
        if (!argMeta) {
            return
        }
        const di = this.parentContainer.createChild({ skipBaseClassChecks: true })
        di.bind(AutocompleteInteraction).toConstantValue(interaction)
        const completer = di.resolve(argMeta.choicesCompleter)
        const choices = await completer.complete(value)
        return choices
    }
}
