import fs from "fs";
import path from "path";

import { ChannelType, GuildTextBasedChannel } from "discord.js";
import { HadesClient } from "@hades-ts/hades";
import { BaseFiletypeStash, MarkdownStash } from "../Stash";
import { embedSchema, EmbedSchema } from "../../schemas";
import { z } from "zod";
import { renderComponents, renderEmbedRecord } from "../../utils";


export class ChannelSync {

    constructor(
        protected client: HadesClient,
        protected channelId: string,
        protected stashPath: string,
    ) { }

    protected async cleanupChannel(channel: GuildTextBasedChannel) {    
        const messages = await channel.messages.fetch();
        await channel.bulkDelete(messages.filter(
            message => !message.pinned
        ));
    }

    protected async createStash() {
        return new MarkdownStash(
            this.stashPath,
            embedSchema,
        )
    }

    protected async getOrdering(stash: BaseFiletypeStash<typeof embedSchema>) {
        const orderFile = path.join(this.stashPath, "order.json");
        if (fs.existsSync(orderFile)) {
            const text = fs.readFileSync(orderFile, "utf8");
            const data = JSON.parse(text);
            return z.array(z.string()).nonempty().parse(data);
        }

        return stash.index();
    }

    protected async sendMessage(channel: GuildTextBasedChannel, embedRecord: EmbedSchema) {
        const embed = await renderEmbedRecord(embedRecord);
        const hasButtons = embedRecord.buttons && embedRecord.buttons.length > 0;
        if (hasButtons) {
            const components = await renderComponents(embedRecord)
            await channel.send({
                embeds: [embed],
                components: [components],
            })
        } else {
            await channel.send({
                embeds: [embed],
            })
        }
    }

    protected async sendMessages(
        channel: GuildTextBasedChannel, 
        stash: BaseFiletypeStash<typeof embedSchema>, 
        index: string[]
    ) {
        for (const key of index) {
            const embedRecord = stash.get(key);
            await this.sendMessage(channel, embedRecord);
        }
    }

    async sync() {
        const channel = await this.client.channels.fetch(this.channelId);

        if (!channel) return;
        if (channel.type !== ChannelType.GuildText) return;

        const stash = await this.createStash();
        const textChannel = channel as GuildTextBasedChannel;
        const index = await this.getOrdering(stash);

        await this.cleanupChannel(textChannel);
        await this.sendMessages(channel, stash, index);
    }
}