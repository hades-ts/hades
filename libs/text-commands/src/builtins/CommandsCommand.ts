import { inject } from "inversify";

import { command, description } from "../commands";
import { TextCommand } from "../commands/services/TextCommand";
import { TextCommandHelpService } from "../commands/services/TextCommandHelpService";

@command("commands")
@description("List all commands.")
export class CommandsCommand extends TextCommand {
    @inject(TextCommandHelpService)
    protected commandService: TextCommandHelpService;

    execute() {
        const embeds = [this.commandService.getCommandsEmbed()];
        return this.reply("all commands I know:", { embeds });
    }
}
