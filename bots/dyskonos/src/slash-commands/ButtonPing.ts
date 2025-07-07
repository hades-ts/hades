import {
    ActionRowBuilder,
    ButtonBuilder,
    type ButtonInteraction,
    ButtonStyle,
    ComponentType,
    InteractionType,
} from "discord.js";

import { interaction } from "@hades-ts/interactions";
import { command, SlashCommand } from "@hades-ts/slash-commands";

@interaction(InteractionType.MessageComponent, ComponentType.Button)
export class ButtonPingInteraction {
    async execute(interaction: ButtonInteraction): Promise<void> {
        if (interaction.customId !== "ping") {
            return;
        }

        await interaction.update({
            content: "Pong!",
            components: [],
        });
    }
}

@command("button-ping", { description: "Use a button to ping the bot." })
export class ButtonPingCommand extends SlashCommand {
    async execute(): Promise<void> {
        const button = new ButtonBuilder()
            .setCustomId("ping")
            .setLabel("Ping")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await this.interaction.reply({
            content: "Click to ping!",
            components: [row],
            withResponse: true,
        });
    }
}
