import { ButtonBuilder, ButtonInteraction, ButtonStyle, Collection } from "discord.js";
import { BaseButtonInteraction } from "@hades-ts/hades";


export class CounterButton extends BaseButtonInteraction {

    private count = 0;

    build() {
        return new ButtonBuilder()
            .setCustomId(this.id)
            .setLabel("Click me!")
            .setStyle(ButtonStyle.Primary)
    }

    protected async onClick(interaction: ButtonInteraction<"cached">) {
        await interaction.update({
            content: `Button clicked ${++this.count} times!`,
            components: [ this.asRow() ]
        })
    }

    protected async cleanup(interaction: ButtonInteraction, interactions: Collection<string, ButtonInteraction<"cached">>) {
        await interaction.message.edit({
            components: [],
            content: interactions.size === 0 
                ? "You didn't click the button in time!"
                : `You clicked the button ${this.count} times!`,
        })
    }
}