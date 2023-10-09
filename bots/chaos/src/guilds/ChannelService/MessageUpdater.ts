import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { HadesClient } from "@hades-ts/hades";
import { GuildMember, TextChannel, Message } from "discord.js";
import { inject } from "inversify";

import { GuildConfig } from "../../config";
import { WithRequired } from "../../types";
import { DataService } from "./DataService";
import { ChannelMessageFormatter } from "./MessageFormatter";
import { ChannelWordValidator } from "./WordValidator";

@guildSingleton()
export class MessageUpdater {
    @inject(HadesClient)
    private client!: HadesClient;

    @inject(guildTokens.GuildConfig)
    private config!: WithRequired<GuildConfig, "channel">;

    @inject(ChannelMessageFormatter)
    private formatter!: ChannelMessageFormatter;

    @inject(ChannelWordValidator)
    private validator!: ChannelWordValidator;

    @inject(DataService)
    private dataService!: DataService;

    protected async updateMessage(threadId: string, text: string) {
        const channel: TextChannel = (await this.client.channels.fetch(this.config.channel.id)) as TextChannel;
        const message: Message = await channel.messages.fetch(threadId);

        if (!message) {
            throw new Error("No message found");
        }

        const updatedContent = this.formatter.update(message, text);
        await message.edit(updatedContent);
    }

    async addWord(user: GuildMember, word: string) {
        const data = this.dataService.getData();

        if (data === null) {
            throw new Error("No data found");
        }

        this.validator.validateWord(user, word);
        const { thread, users, text } = data;
        const words = text.split(" ");
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
