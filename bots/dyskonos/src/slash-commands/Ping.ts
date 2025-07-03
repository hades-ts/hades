import { inject } from "inversify";

import { GuildInfo } from "@hades-ts/guilds";
import { command, SlashCommand } from "@hades-ts/slash-commands";

import { ILogger, logger } from "@hades-ts/logging";
import type { GuildConfig } from "../config";

@command("ping", { description: "Ping the bot." })
export class PingCommand extends SlashCommand {
    @inject(GuildInfo)
    public info!: GuildInfo<GuildConfig>;

    @logger("PingCommand")
    protected logger!: ILogger;

    async execute(): Promise<void> {
        this.logger.info("Bot was pinged!", {
            extra: "Hello world!"
        });
        const content = this.info.config?.guildPongMessage ?? "Pong!";
        await this.interaction.reply({ content });
    }
}
