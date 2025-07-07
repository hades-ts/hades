import {
    type BaseInteraction,
    type ChatInputApplicationCommandData,
    type CommandInteraction,
    Events,
} from "discord.js";
import { Container, inject } from "inversify";

import { HadesClient, listener, listenFor, service } from "@hades-ts/core";
import { type ILogger, logger } from "@hades-ts/logging";

import { getSlashCommandMetas } from "../../metadata";
import { SlashCommandFactoryRegistry } from "../SlashCommandFactory";
import { ISlashCommandDispatch } from "./ISlashCommandDispatch";

@listener()
@service()
export class SlashCommandService {
    @inject(HadesClient)
    private readonly client!: HadesClient;

    @listenFor(Events.ClientReady)
    async onReady(): Promise<void> {
        this.registerCommands(this.client);
    }

    @listenFor(Events.InteractionCreate)
    async onInteractionCreate(interaction: BaseInteraction) {
        if (interaction.isCommand()) {
            await this.dispatch(interaction);
        }
    }

    @inject(Container)
    protected container!: Container;

    /** factories for creating command instances */
    @inject(SlashCommandFactoryRegistry)
    public factories!: SlashCommandFactoryRegistry;

    @logger("SlashCommandService")
    protected log!: ILogger;

    @inject(ISlashCommandDispatch)
    protected dispatcher!: ISlashCommandDispatch;

    async dispatch(interaction: CommandInteraction) {
        await this.dispatcher.dispatch(interaction);
    }

    async registerCommands(client: HadesClient) {
        const config = this.getCommandRegistrationMeta();
        this.log.info(`Registering slash commands.`, {
            guild: client.guilds.cache.size,
            commands: config.map((c) => c.name),
        });
        await client.application?.commands.set(config);
    }

    protected getCommandRegistrationMeta(): ChatInputApplicationCommandData[] {
        const commands = getSlashCommandMetas().map((meta) => {
            return {
                ...meta.registrationDetails,
                options: meta.args.map((arg) => {
                    if (arg.choicesResolver) {
                        const resolver = this.container.get(
                            arg.choicesResolver,
                            { autobind: true },
                        );
                        const choices = (resolver as any).getChoices();
                        arg.options = {
                            ...arg.options,
                            choices,
                        } as any;
                    } else if (arg.choicesCompleter) {
                        arg.options = {
                            ...arg.options,
                            autocomplete: true,
                        } as any;
                    }
                    return {
                        ...arg.options,
                    };
                }),
            };
        });
        // TODO: fix this
        return commands as unknown as ChatInputApplicationCommandData[];
    }
}
