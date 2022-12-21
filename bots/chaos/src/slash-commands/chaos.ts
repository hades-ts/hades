import { inject } from "inversify";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand, arg, validate, SlashArgError } from "@hades-ts/slash-commands";
import { ChannelWordAdder, GuildManager, ThreadWordAdder } from "../guilds";
import { ConfigGuild } from "../config";


@command("chaos", { description: "Add a word to today's chaos message." })
export class ChaosCommand extends SlashCommand {

    @arg({ description: "Your word.", type: ApplicationCommandOptionType.String })
    word!: string;

    @inject('cfg.guilds')
    configGuilds!: Record<string, ConfigGuild>;

    @inject(HadesClient)
    client!: HadesClient;

    @inject(GuildManager)
    guildManager!: GuildManager;

    @inject(ChannelWordAdder)
    channelWordAdder!: ChannelWordAdder;

    @inject(ThreadWordAdder)
    threadWordAdder!: ThreadWordAdder;

    @validate("word")
    protected validateWord() {
        if (this.word.split(/\s+/).length > 1) {
            throw new SlashArgError("Please only use one word.");
        }
    }

    protected async reject(content: string) {
        try {
            await this.interaction.deferReply({
                ephemeral: true,
            })
            await this.interaction.editReply({
                content,
            })
        } catch (error) {
            console.error(`Couldn't reply to user:`, error);
        }
    }

    async execute(): Promise<void> {
        try {
            if (this.interaction.channel?.type === ChannelType.PublicThread) {
                await this.threadWordAdder.execute(this.interaction, this.word);
            } else {
                await this.channelWordAdder.execute(this.interaction, this.word);
            }
        } catch (error) {
            if (error instanceof Error) {
                await this.reject(error.message);
            } else {
                await this.reject("Sorry, something went wrong. Try again later!");
            }
        }
    }

}