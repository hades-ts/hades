import { HadesClient } from "@hades-ts/hades";
import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import { inject, postConstruct } from "inversify";
import { DateTime } from "luxon";
import { ConfigGuild } from "../../config";
import { guildSingleton } from "../decorators";
import { tokens } from "../tokens";
import { ChannelCleaner } from "./ChannelCleaner";
import { CronService } from "./CronService";
import { Data, DataService } from "./DataService";
import { MessageFormatter } from "./MessageFormatter";
import { MessageFilter } from "./MessageFilter";
import { LimitBypass } from "./LimitBypass";
import { RolloverService } from "./RolloverService";

@guildSingleton()
export class WordValidator {

    @inject(DataService)
    private dataService!: DataService;

    @inject(LimitBypass)
    private bypass!: LimitBypass;

    validateWord(user: GuildMember, word: string) {
        const data = this.dataService.getData();

        if (data === null) {
            throw new Error('No data found');
        }

        if (!this.bypass.isExempt(user)) {
            throw new Error('You already added a word!');
        }

        if (word.length > 16) {
            throw new Error('Keep your word under 16 characters :)');
        }

        if (!/^[a-zA-Z0-9]+('[st])?[\.,:;!?]?$/.test(word)) {
            throw new Error("Keep it simple. :) `/^[a-zA-Z0-9]+('[st])?[\.,:;!?]?$/`");
        }

        return data
    }
}
    