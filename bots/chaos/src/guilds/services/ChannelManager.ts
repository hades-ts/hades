import { GuildMember, TextChannel } from "discord.js";
import { inject } from "inversify";
import { DateTime } from "luxon";
import { ConfigGuild } from "../../config";
import { guildSingleton } from "../decorators";
import { tokens } from "../tokens";
import { ChannelCleaner } from "./ChannelCleaner";
import { CronService } from "./CronService";
import { DataService } from "./DataService";
import { MessageFormatter } from "./MessageFormatter";
import { RolloverService } from "./RolloverService";
import { WordValidator } from "./WordValidator";

@guildSingleton()
export class ChannelManager {

    @inject(tokens.GuildId)
    private guildId!: string;

    @inject(tokens.GuildConfig)
    private config!: ConfigGuild;

    @inject(tokens.ChannelFactory)
    private getChannel!: () => Promise<TextChannel>;

    @inject(DataService)
    private dataService!: DataService;

    @inject(CronService)
    private cronService!: CronService;

    @inject(ChannelCleaner)
    private channelCleaner!: ChannelCleaner;

    @inject(MessageFormatter)
    private formatter!: MessageFormatter;

    @inject(WordValidator)
    private validator!: WordValidator;

    @inject(RolloverService)
    private rolloverService!: RolloverService;

    async rollover() {
        this.dataService.clearData();
        await this.checkRollover();
    }

    async checkRollover() {
        const rolloverStatus = await this.rolloverService.checkRollover();
        switch (rolloverStatus.type) {
            case 'empty':
                await this.createMessage();
                break;
            case 'passed':
                await this.createMessage(rolloverStatus.changeOver);
                break;
            case 'scheduled':
                this.cronService.schedule(rolloverStatus.changeOver.plus({
                    seconds: 10,
                }), () => this.checkRollover());
                break;
        }
    }

    protected createData(threadId: string, created: DateTime) {
        return {
            thread: threadId,
            created: created.toISO(),
            text: '',
            users: [],
        }
    }

    protected saveNewData(threadId: string, datetime?: DateTime) {
        console.log(`[ChannelManager] Saving data for guild ${this.guildId}`);        
        const created = (datetime || DateTime.now()).toUTC();
        const data = this.createData(threadId, created)
        this.dataService.saveData(data);
    }

    protected scheduleNextMessage(datetime?: DateTime) {
        console.log(`[ChannelManager] Scheduling next message for guild ${this.guildId}`);
        const period = this.config.period || { days: 1 };
        const basis = datetime || DateTime.now();
        this.cronService.schedule(basis.toUTC().plus(period), () => this.checkRollover());
    }

    protected async sendNewMessage() {
        console.log(`[ChannelManager] Sending new message for guild ${this.guildId}`);
        const channel = await this.getChannel();
        const messageContent = this.formatter.create();
        const message = await channel.send(messageContent)
        return message;
    }

    async createMessage(datetime?: DateTime) {
        const message = await this.sendNewMessage();
        this.saveNewData(message.id, datetime)
        await this.channelCleaner.cleanup();
        this.scheduleNextMessage();
    }

    protected async updateMessage(threadId: string, text: string) {
        const channel = await this.getChannel();
        const message = await channel.messages.fetch(threadId);

        if (!message) {
            throw new Error('No message found');
        }

        const updatedContent = this.formatter.update(message, text)
        message.edit(updatedContent);
    }

    async addWord(user: GuildMember, word: string) {
        const data = this.validator.validateWord(user, word);
        const { thread, users, text } = data;
        const words = text.split(' ');
        const lastWord = words[words.length - 1];

        if (lastWord.toLowerCase() === word.toLowerCase()) {
            throw new Error(`That's the same word as the last one!`);
        }

        users.push({
            id: user.id,
            name: user.displayName,
            word,
        });

        data.text = `${text} ${word}`;
        this.dataService.saveData(data);
        await this.updateMessage(thread, data.text);
    }
}
    