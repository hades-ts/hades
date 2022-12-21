import { inject } from "inversify";
import { ConfigGuild } from "../../../config";
import { WithRequired } from "../../../types";
import { guildSingleton } from "../../decorators";
import { tokens } from "../../tokens";
import { BaseMessageFormatter } from "../MessageFormatter";


@guildSingleton()
export class ThreadMessageFormatter extends BaseMessageFormatter {

    @inject(tokens.GuildConfig)
    protected config!: WithRequired<ConfigGuild, 'threads'>;

    protected async createFooter(): Promise<string> {
        return `Use /chaos <word> in the thread to add a word.`
    }

}
    