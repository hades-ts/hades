import fs from "fs";
import path from "path";

import {
    ChannelType,
    type GuildTextBasedChannel,
    type MessageCreateOptions,
} from "discord.js";
import { z } from "zod/v4";

import type { HadesClient } from "@hades-ts/core";
import { MarkdownStash } from "@hades-ts/stash";

import { type EmbedSchema, embedSchema } from "../../schemas";
import { renderComponents, renderEmbedRecord } from "../../utils";

export class ChannelSync {
    // eslint-disable-next-line no-useless-constructor
    constructor(
        protected client: HadesClient,
        protected channelId: string,
        protected stashPath: string,
    ) {}

    protected async cleanupChannel(channel: GuildTextBasedChannel) {
        const messages = await channel.messages.fetch();
        await channel.bulkDelete(messages.filter((message) => !message.pinned));
    }

    protected async createStash() {
        return new MarkdownStash<EmbedSchema>(this.stashPath, embedSchema);
    }

    protected async getOrdering(stash: MarkdownStash<EmbedSchema>) {
        const orderFile = path.join(this.stashPath, "order.json");
        if (fs.existsSync(orderFile)) {
            const text = fs.readFileSync(orderFile, "utf8");
            const data = JSON.parse(text);
            return z.array(z.string()).nonempty().parse(data);
        }

        return stash.index();
    }

    protected async sendMessage(
        channel: GuildTextBasedChannel,
        embedRecord: EmbedSchema,
    ) {
        const embed = await renderEmbedRecord(embedRecord);
        const hasButtons =
            embedRecord.buttons && embedRecord.buttons.length > 0;

        const messageOptions: MessageCreateOptions = {
            embeds: [embed],
        };

        if (hasButtons) {
            const components = renderComponents(embedRecord);
            messageOptions.components = [components];
        }

        await channel.send(messageOptions);
    }

    protected async sendMessages(
        channel: GuildTextBasedChannel,
        stash: MarkdownStash<EmbedSchema>,
        index: string[],
    ) {
        for (const key of index) {
            const mdRecord = stash.get(key);
            const embedRecord = mdRecord.data.data;
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
