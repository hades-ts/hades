import { command, TextCommand } from "@hades-ts/text-commands"

import { CounterButton } from "../utils"


@command("button-test")
export class ButtonTestCommand extends TextCommand {

    async execute() {
        const button = new CounterButton(this.context.msg.channel)

        await this.msg.reply({
            content: "Click the button!",
            components: [
                button.asRow()
            ]
        })
    }
}