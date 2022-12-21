import { GuildMember } from "discord.js";
import { inject } from "inversify";
import { guildSingleton } from "../../decorators";
import { WordValidator } from "../WordValidator";
import { DataService } from "./DataService";
import { LimitBypass } from "./LimitBypass";


@guildSingleton()
export class ChannelWordValidator extends WordValidator {

    @inject(LimitBypass)
    private bypass!: LimitBypass;

    validateWord(user: GuildMember, word: string) {

        if (!this.bypass.isExempt(user)) {
            throw new Error('You already added a word!');
        }

        super.validateWord(user, word);

    }
}
    