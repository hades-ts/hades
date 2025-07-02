import { inject } from "inversify";

import { GuildInfo } from "@hades-ts/guilds";
import { command, SlashCommand } from "@hades-ts/slash-commands";

import type { Config, GuildConfig } from "../config";

@command("ping", { description: "Ping the bot." })
export class PingCommand extends SlashCommand {
    @inject(GuildInfo)
    public info!: GuildInfo<GuildConfig>;

    async execute(): Promise<void> {
        const content = this.info.config?.guildPongMessage ?? "Pong!";
        await this.interaction.reply({ content });
    }
}
