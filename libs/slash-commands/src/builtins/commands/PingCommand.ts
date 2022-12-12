import { SlashCommand } from "../../models";
import { command } from "../decorators";


@command("ping", { description: "Returns pong 🏓" })
export class PingCommand extends SlashCommand {
  async execute() {
    const then = this.interaction.createdTimestamp;
    const now = Date.now();
    const delta = new Date(now - then);
    const seconds = delta.getSeconds();
    const milliseconds = delta.getMilliseconds();
    const total = (seconds * 1000 + milliseconds) / 1000.0;
    await this.reply(`Pong in ${total} seconds!`);
  }
}
