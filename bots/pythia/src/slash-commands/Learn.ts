import {
    ApplicationCommandOptionType,
    EmbedBuilder
} from "discord.js";
import { inject } from "inversify";

import { HadesClient } from "@hades-ts/core";
import {
    arg,
    guildCommand,
    SlashCommand
} from "@hades-ts/slash-commands";
import { CreateFactAction } from "../db";


@guildCommand("learn", { description: "Teach the bot a fact." })
export class LearnCommand extends SlashCommand {
    @arg({
        description: "The fact to learn.",
        type: ApplicationCommandOptionType.String,
    })
    fact!: string;

    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(CreateFactAction)
    protected createFactAction!: CreateFactAction;

    protected async reject(content: string) {
        await this.interaction.editReply({
            content,
        });
    }

    async execute(): Promise<void> {
        await this.interaction.deferReply({
            ephemeral: true,
        });

        try {
            await this.createFactAction.execute(
                this.interaction.guildId, 
                this.interaction.user.id, 
                this.fact);    
        } catch (error) {
            return this.handleError(error);
        }

        await this.interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("Fact learned!")
                    .setDescription(this.fact)
            ]
        });

    }

    async handleError(error: Error) {
        await this.reject(
            `Sorry, I'm having trouble right now. Try again later!`,
        );
        return;
    }
}
