import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { HadesClient } from "@hades-ts/hades";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, GuildTextBasedChannel, Role, TextChannel } from "discord.js";
import { inject, postConstruct } from "inversify";
import { GuildConfig } from "../config";
import { RoleRecord } from "../schemas";
import { GuildRoleStash } from "./GuildRoleStash";

@guildSingleton()
export class GuildRolesChannel {
    /**
     * This service maintain a number of messages in the configured channel.
     * 
     * One for each guild role. Each has a button to toggle the role.
     */

    @inject(HadesClient)
    client!: HadesClient;

    @inject(guildTokens.GuildId)
    guildId!: string;

    @inject(guildTokens.GuildConfig)
    guildConfig!: GuildConfig;

    @inject(GuildRoleStash)
    roles!: GuildRoleStash;

    @postConstruct()
    protected init () {   
        this.client.on('interactionCreate', async interaction => {
            if (interaction.channelId !== this.guildConfig.rolesChannel) return;

            const button = interaction.isButton() && interaction;

            if (!button) return;

            const guild = await this.client.guilds.fetch(this.guildId);
            const roleId = interaction.customId.split("-")[1];
            const role = await guild.roles.fetch(roleId);

            if (!role) return;

            const member = await guild.members.fetch(interaction.user.id);

            if (!member) return;

            const roleManager = member.roles;

            if (roleManager.cache.has(roleId)) {
                await roleManager.remove(role);
                await interaction.reply({
                    content: `Removed role ${role.name}`,
                    ephemeral: true,
                })
            } else {
                await roleManager.add(role);
                await interaction.reply({
                    content: `Added role ${role.name}`,
                    ephemeral: true,
                })
            }
        })
    }

    protected async cleanupChannel(channel: GuildTextBasedChannel) {    
        if (!channel) return;

        if (channel.type !== ChannelType.GuildText) return;

        const messages = await channel.messages.fetch();

        // remove any unpinned messages
        await channel.bulkDelete(messages.filter(
            message => !message.pinned
        ));
    }

    protected async renderRole(role: Role, roleRecord: RoleRecord) {

        let embed = new EmbedBuilder()
            .setTitle(role.name)
            .setDescription(roleRecord.content)
            .setFooter({ text: roleRecord.description })

        return embed;
    }

    protected async renderToggleButton(role: Role) {
        return 
    }

    protected async sendRoleMessage(channel: GuildTextBasedChannel, role: Role, roleRecord: RoleRecord) {
        const embed = await this.renderRole(role, roleRecord);
        const toggleButton = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`role-${role.id}`)
                    .setLabel("Toggle Role")
                    .setStyle(ButtonStyle.Primary)
            )

        await channel.send({
            embeds: [embed],
            components: [toggleButton],
        })
    }

    async install() {
        const guild = await this.client.guilds.fetch(this.guildId);

        const channelId = this.guildConfig.rolesChannel;

        if (!channelId) return;

        const channel = await this.client.channels.fetch(channelId);

        if (!channel) return;

        if (channel.type !== ChannelType.GuildText) return;

        const textChannel = channel as GuildTextBasedChannel;

        await this.cleanupChannel(textChannel);

        for (const roleKey of this.roles.stash.index()) {
            const record = this.roles.stash.get(roleKey);
            const role = await guild.roles.fetch(record.roleId);

            if (!role) continue;

            await this.sendRoleMessage(textChannel, role, record);
        }
    }

}