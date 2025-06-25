import { DiscordService } from "@hades-ts/hades";
import type { CommandInteraction, InteractionReplyOptions, Message } from "discord.js";
import { inject, injectable } from "inversify";

/**
 * Base slash command class.
 */
@injectable()
export abstract class SlashCommand {
    /** information on the current command invocation */
    @inject("Interaction")
    protected interaction!: CommandInteraction;

    /** service for getting data from discord */
    @inject(DiscordService)
    protected discord!: DiscordService;

    /** main command logic handler */
    abstract execute(): Promise<void>;

    public reply(content: string, options?: InteractionReplyOptions) {
        return this.interaction.reply({ ...options, content });
    }

    public followUp(content: string, options?: InteractionReplyOptions) {
        return this.interaction.followUp({ ...options, content }) as Promise<Message>;
    }

    public async deferReply() {
        return await this.interaction.deferReply();
    }
}
