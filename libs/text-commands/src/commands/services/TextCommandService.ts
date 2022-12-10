import { singleton } from '@hades-ts/hades';
import { Message } from 'discord.js';
import { inject } from 'inversify';
import { TextArgError } from '../../arguments';
import { TextParserService } from '../../parsing';
import { TextCommandContext } from '../models';
import { TextCommandFactoryRegistry } from './TextCommandFactoryRegistry';
import { TextCommandHelpService } from './TextCommandHelpService';


/**
 * Orchestrates parsing and executing commands.
 *
 * TODO: Actually implement sensible command prefix support.
 *
 */
@singleton(TextCommandService)
export class TextCommandService {
    /** the command prefix */
    prefix: string;

    /** service for parsing incoming messages */
    @inject(TextParserService)
    parserService: TextParserService

    /** factories for creating command instances */
    @inject(TextCommandFactoryRegistry)
    factories: TextCommandFactoryRegistry

    @inject(TextCommandHelpService)
    help: TextCommandHelpService

    async execute(ctx: TextCommandContext) {
        const factory = this.factories.factoryFor(ctx.command);

        if (factory) {
            try {
                const command = await factory.create(ctx);
                await command.execute();
            } catch (e: unknown) {
                if (e instanceof TextArgError) {
                    if (e.showHelp) {
                        ctx.msg.reply({
                            content: e.message,
                            embeds: [this.help.getHelpEmbed(ctx.command)]
                        });
                    } else {
                        ctx.msg.reply(e.message);
                    }
                } else {
                    ctx.msg.reply("Erm, uh well something went wrong. Dunno what though.");
                    console.error(e);
                }
            }
        }
    }

    dispatch(msg: Message) {
        const parsedMessage = this.parserService.parse(msg)
        if (parsedMessage) {
            this.execute(parsedMessage)
        }
    }
}
