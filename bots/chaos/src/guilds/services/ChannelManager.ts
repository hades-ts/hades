import { HadesClient, singleton } from "@hades-ts/hades";
import { EmbedBuilder, TextChannel } from "discord.js";
import { inject, postConstruct } from "inversify";
import { DateTime } from "luxon";
import { ConfigGuild } from "../../config";
import { guildRequest } from "../decorators";
import { tokens } from "../tokens";
import { DataService } from "./DataService";

@guildRequest()
export class ChannelManager {

    @inject(HadesClient)
    client: HadesClient;

    @inject(tokens.GuildId)
    guildId: string;

    @inject('cfg.botOwner')
    botOwner: string;

    @inject('cfg.guilds')
    configGuilds: Record<string, ConfigGuild>;

    @inject(DataService)
    dataService: DataService;

    get config() {
        return this.configGuilds[this.guildId] || null;
    }

    get channel(): TextChannel {
        return this.client.channels.cache.get(this.config.channel) as TextChannel;
    }

    @postConstruct() 
    init () {
        if (!this.config) {
            throw new Error(`No config for guild ${this.guildId}`);
        }

        this.client.on('ready', () => {
            if (!this.channel) {
                throw new Error(`Channel ${this.config.channel} on guild ${this.guildId} not found`);
            }
        })

        this.client.on('messageCreate', message => {
            if (message.channel.id !== this.config.channel) {
                return;
            }

            if (message.author.bot) {
                return;
            }

            message.delete();
        })

        this.loadData()
    }

    async createMessage(dateTime: DateTime) {
        const channel = this.channel as TextChannel;

        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Chaos message for ${dateTime.toLocaleString({
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}:`)
                    .setDescription(`No words yet!`)
                    .setFooter({
                        text: 'Add a word with /chaos <word>',
                    })
            ]
        })
        this.dataService.saveData({
            date: dateTime.toISODate(),
            text: '',
            users: [],
        });
    }

    async loadData() {
        const data = this.dataService.getData();
        const { hour } = this.config;

        if (data === null) {
            const now = DateTime.now();
            const changeOver = now.set({ hour });
            const hasPassed = changeOver < now;

            if (hasPassed) {
                await this.createMessage(changeOver);
            } else {
                const previousDay = changeOver.minus({ days: 1 });
                await this.createMessage(previousDay);
            } 
        } else {
            const { date } = data;
            const dateObj = DateTime.fromFormat(date, 'yyyy-MM-dd');
            const changeOver = dateObj.plus({days: 1}).set({ hour });
            const hasPassed = changeOver < DateTime.now();

            if (hasPassed) {
                await this.createMessage(changeOver);
            }                
        }
    }

    async addWord(userId: string, word: string) {
        const data = this.dataService.getData();
        if (data === null) {
            throw new Error('No data found');
        }

        const { users, text } = data;
        if (userId !== this.botOwner && users.includes(userId)) {
            throw new Error('User already added a word');
        }

        users.push(userId);
        data.text = `${text} ${word}`;
        this.dataService.saveData(data);
        await this.updateMessage(data.text);
    }

    async updateMessage(text: string) {
        const channel = this.channel as TextChannel;
        const messages = await channel.messages.fetch();
        const message = messages.first();

        if (!message) {
            throw new Error('No message found');
        }

        const embed = message.embeds[0];

        message.edit({
            embeds: [
                new EmbedBuilder(embed)
                    .setDescription(`\`\`\`\n${text}\n\`\`\``)
            ]
        });
    }
}
    