import { Container, inject } from "inversify";

import { type ILogger, logger } from "@hades-ts/logging";
import { guildCommand, SlashCommand } from "@hades-ts/slash-commands";

import { GuildIdService } from "../guildServices/GuildIdService";

@guildCommand("guild-id", { description: "Get the guild ID." })
export class GuildIdCommand extends SlashCommand {
    @inject(GuildIdService)
    protected guildIdService!: GuildIdService;

    @logger("GuildIdCommand")
    protected log!: ILogger;

    @inject(Container)
    protected container!: Container;

    async execute(): Promise<void> {
        this.log.debug(
            `Executing guild ID command. Container type: ${(this.container as any).type}`,
        );
        await this.interaction.reply({
            content: `Guild ID: ${this.guildIdService.getGuildId()}`,
        });
    }
}
