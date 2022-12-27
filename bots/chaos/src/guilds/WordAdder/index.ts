import { HadesClient } from "@hades-ts/hades"
import { CommandInteraction } from "discord.js"
import { inject, injectable } from "inversify"

import { GuildConfig } from "../../config"


@injectable()
export abstract class WordAdder {

    @inject(HadesClient)
    protected client!: HadesClient

    protected abstract guildConfig: GuildConfig;

    abstract addWord(interaction: CommandInteraction, word: string): Promise<void>;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async validate(_interaction: CommandInteraction, _word: string) {

        if (!this.guildConfig) {
            throw new Error("Sorry, I'm not set up for this guild yet. Try again later!")
        }

        if (this.guildConfig.disabled) {
            throw new Error("Sorry, I'm disabled in this server at the moment.")
        }

    }

}