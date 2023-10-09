import { command, SlashCommand } from "@hades-ts/slash-commands";

import { CounterButton } from "../utils";

@command("button-test", { description: "Button interaction test." })
export class ButtonTestCommand extends SlashCommand {
    async execute() {
        const button = new CounterButton(this.interaction.channel);

        await this.interaction.reply({
            content: "Click the button!",
            components: [button.asRow()],
        });
    }
}
