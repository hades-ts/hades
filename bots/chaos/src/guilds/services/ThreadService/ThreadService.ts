import { CommandInteraction, GuildMember, Message } from "discord.js";
import { inject } from "inversify";
import { guildSingleton } from "../../decorators";
import { ThreadWordAdder } from "./ThreadWordAdder";
import { ThreadFactory } from "./ThreadFactory";


@guildSingleton()
export class ThreadService {

    @inject(ThreadFactory)
    private factory!: ThreadFactory;

    @inject(ThreadWordAdder)
    protected adder!: ThreadWordAdder;

    async validateCreation(memberId: string, channelId: string) {
        return this.factory.validateCreation(memberId, channelId);
    }

    async createThread(member: GuildMember, message: Message) {
        return this.factory.createThread(member, message);
    }   
    
    async addWord(interaction: CommandInteraction, word: string) {
        await this.adder.addWord(interaction, word);
    }

}