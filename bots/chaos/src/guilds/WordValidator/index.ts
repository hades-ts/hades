import { guildSingleton } from "@hades-ts/guilds"
import { GuildMember } from "discord.js"



@guildSingleton()
export class WordValidator {

    validateWord(user: GuildMember, word: string) {

        if (word.length > 16) {
            throw new Error('Keep your word under 16 characters :)')
        }

        if (!/^[a-zA-Z0-9]+('[st])?[\.,:;!?]?$/.test(word)) {
            throw new Error("Keep it simple. :) `/^[a-zA-Z0-9]+('[st])?[\.,:;!?]?$/`")
        }

    }
}