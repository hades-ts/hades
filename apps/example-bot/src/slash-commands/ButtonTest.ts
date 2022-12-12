import { ButtonBuilder } from "discord.js";
import { command, SlashCommand } from "@hades-ts/slash-commands";


@command("button-test", { description: "Button interaction test." })
export class ButtonTestCommand extends SlashCommand {

    async execute() {
        const button = new ButtonBuilder()
    }
}