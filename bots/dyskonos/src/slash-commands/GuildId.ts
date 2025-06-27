import { guildCommand, SlashCommand } from "@hades-ts/slash-commands";
import { inject } from "inversify";
import { GuildIdService } from "../guildServices/GuildIdService";

@guildCommand("guild-id", { description: "Get the guild ID." })
export class GuildIdCommand extends SlashCommand {
    @inject(GuildIdService)
    protected guildIdService!: GuildIdService;

    async execute(): Promise<void> {
        await this.interaction.reply({
            content: `Guild ID: ${this.guildIdService.getGuildId()}`,
        });
    }
}
