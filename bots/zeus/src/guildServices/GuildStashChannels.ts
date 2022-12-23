import fs from "fs";
import path from "path";

import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { HadesClient } from "@hades-ts/hades";
import { MarkdownStash } from "@hades-ts/stash";
import { ChannelType, EmbedBuilder, Guild, GuildTextBasedChannel, Role } from "discord.js";
import { inject } from "inversify";
import { GuildConfig } from "../config";
import { EmbedSchema, embedSchema } from "../schemas/embedSchema";

@guildSingleton()
export class GuildStashChannels {
    /**
     * This service maintain a number of messages in the configured channel.
     * 
     * One for each guild role. Each has a button to toggle the role.
     */
    @inject('cfg.dataPath')
    protected readonly dataPath!: string;

    @inject(HadesClient)
    client!: HadesClient;

    @inject(guildTokens.GuildId)
    guildId!: string;

    @inject(guildTokens.GuildConfig)
    guildConfig!: GuildConfig;

    protected async cleanupChannel(channel: GuildTextBasedChannel) {    
        const messages = await channel.messages.fetch();
        await channel.bulkDelete(messages.filter(
            message => !message.pinned
        ));
    }

    protected async renderEmbed(embedRecord: EmbedSchema) {
        let embed = new EmbedBuilder()

        if (embedRecord.title) embed.setTitle(embedRecord.title)
        if (embedRecord.content) embed.setDescription(embedRecord.content)
        // if (embedRecord.color) embed.setColor(embedRecord.color)
        if (embedRecord.imageUrl) embed.setImage(embedRecord.imageUrl)
        if (embedRecord.thumbnailUrl) embed.setThumbnail(embedRecord.thumbnailUrl)
        if (embedRecord.author) embed.setAuthor(embedRecord.author)
        if (embedRecord.footer) embed.setFooter(embedRecord.footer)
        embed.addFields(embedRecord.fields)
        return embed;
    }

    protected async renderToggleButton(role: Role) {
        return 
    }

    protected async sendRoleMessage(channel: GuildTextBasedChannel, embedRecord: EmbedSchema) {
        const embed = await this.renderEmbed(embedRecord);
        await channel.send({
            embeds: [embed],
        })
    }

    protected async installChannel(guild: Guild, channelId: string, stashPath: string) {
        const fullPath = path.join(this.dataPath, guild.id, stashPath);

        const stash = new MarkdownStash(
            fullPath,
            embedSchema,
        )

        const channel = await this.client.channels.fetch(channelId);

        if (!channel) return;

        if (channel.type !== ChannelType.GuildText) return;

        const textChannel = channel as GuildTextBasedChannel;

        await this.cleanupChannel(textChannel);

        let index = stash.index();

        const orderFile = path.join(fullPath, "order.json");
        if (fs.existsSync(orderFile)) {
            index = JSON.parse(fs.readFileSync(orderFile, "utf8"));
        }

        for (const key of index) {
            const embedRecord = stash.get(key);
            await this.sendRoleMessage(textChannel, embedRecord);
        }
    }

    async install() {
        const guild = await this.client.guilds.fetch(this.guildId);

        for (const [channelId, stashPath] of Object.entries(this.guildConfig.stashChannels)) {
            await this.installChannel(guild, channelId, stashPath);
        }
    }

}