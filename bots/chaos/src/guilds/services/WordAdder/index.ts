import { HadesClient, singleton } from "@hades-ts/hades";
import { CommandInteraction, ChannelType, GuildMember } from "discord.js";
import { inject, injectable } from "inversify";
import { ConfigGuild } from "../../../config";
import { tokens } from "../../tokens";


@injectable()
export abstract class WordAdder {

    @inject(HadesClient)
    protected client!: HadesClient;

    protected abstract guildConfig: ConfigGuild;

    abstract addWord(interaction: CommandInteraction, word: string): Promise<void>;

    protected async validate(interaction: CommandInteraction, word: string) {

        if (!this.guildConfig) {
            throw new Error("Sorry, I'm not set up for this guild yet. Try again later!");
        }

        if (this.guildConfig.disabled) {
            throw new Error("Sorry, I'm disabled in this server at the moment.");
        }     
        
    }

}