import { BaseCommandInteraction, Collection } from "discord.js";
import { Container } from "inversify";
import { SlashCommandMeta } from "../../metadata/SlashCommandMeta";
import { SlashCommand } from "../../models";
import { SlashArgInstaller } from "./SlashArgInstaller";
import { SlashArgParserRegistry } from "./SlashArgParserRegistry";
import { SlashArgParserResolver } from "./SlashArgParserResolver";

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

  /** service for looking up parsers based on argument type */
  inferenceService: SlashArgParserResolver;
  /** service for easy lookup of parsers */
  parserService: SlashArgParserRegistry;
  /** arguments of the associated command */
  argInstallers = new Collection<string, SlashArgInstaller>();

  constructor(parentContainer: Container, meta: SlashCommandMeta) {
    console.log(`Creating factory for ${meta.name}...`)
    this.parentContainer = parentContainer;
    this.meta = meta;

    this.inferenceService = parentContainer.get(SlashArgParserResolver);
    this.parserService = parentContainer.get(SlashArgParserRegistry);
    // setup arguments
    for (let [argName, argMeta] of meta.args) {
      console.log(`Creating arg installer for ${meta.name}.${argName}`)
      const parserType =
        argMeta.parserType || this.inferenceService.infer(argMeta.type);
      const parser = this.parserService.parserFor(parserType);
      console.log(`Decided on parser: ${parserType.name}`)
      const arg = new SlashArgInstaller(argMeta, parser);
      this.argInstallers.set(argName, arg);
    }
  }

  /**
   * Parse and install argument values into a container.
   * @param container Container to install into.
   * @param context The command invocation context.
   */
  async installArguments(container: Container, interaction: BaseCommandInteraction) {
    for (let [_, arg] of this.argInstallers) {
      await arg.install(container, interaction);
    }
  }

  /**
   * Invoke validator methods on the given command instance.
   * @param inst Command instance.
   */
  async runMethodValidators(inst: any) {
      console.log(`Running method validators for ${this.meta.name}...`)
      console.log(`Found ${this.argInstallers.size} args`)
      for (let [_, arg] of this.argInstallers) {
          console.log(`Found ${arg.validatorMethods.size} validators`)
          for (let methodName of arg.validatorMethods) {
              console.log(`Running method validator: ${methodName}... for ${this.meta.name}`)
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
  createSubContainer(interaction: BaseCommandInteraction) {
    const di = this.parentContainer.createChild({ skipBaseClassChecks: true });

    // bind the command class
    di.bind(this.meta.target).toSelf();

    // bind the invocation context
    di
      .bind<BaseCommandInteraction>("Interaction")
      .toConstantValue(interaction);

    // connect the containers
    di.parent = this.parentContainer;
    return di;
  }

  /**
   * Create an instance of the invoked command.
   * @param context A command invocation context.
   * @returns A command instance.
   */
  async create(interaction: BaseCommandInteraction) {
    console.log(`Creating command instance for ${this.meta.name}...`)
    // subcontainer config
    const subContainer = this.createSubContainer(interaction);

    // parse, validate and bind argument values
    await this.installArguments(subContainer, interaction);

    // resolve command instance
    const inst = subContainer.get<SlashCommand>(this.meta.target);

    // run instance-method validators
    console.log("WTF??????????????")
    await this.runMethodValidators(inst);

    return inst;
  }
}
