import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { HadesClient } from "@hades-ts/hades";
import type { ButtonInteraction, CacheType, GuildMemberRoleManager, Interaction, Role } from "discord.js";
import { inject, postConstruct } from "inversify";

@guildSingleton()
export class RoleButtonListener {
    @inject(HadesClient)
    private client!: HadesClient;

    @inject(guildTokens.GuildId)
    private guildId!: string;

    @postConstruct()
    protected init() {
        this.client.on("interactionCreate", this.onInteractionCreate.bind(this));
    }

    protected async onInteractionCreate(interaction: Interaction) {
        const button = interaction.isButton();

        if (!button) return;

        const roleId = this.parseInteractionRoleId(interaction);

        if (!roleId) return;

        const guild = await this.client.guilds.fetch(this.guildId);
        const role = await guild.roles.fetch(roleId);

        if (!role) return;

        const member = await guild.members.fetch(interaction.user.id);

        if (!member) return;

        const roleManager = member.roles;

        if (roleManager.cache.has(roleId)) {
            await this.removeRole(roleManager, role, interaction);
        } else {
            await this.addRole(roleManager, role, interaction);
        }
    }

    protected parseInteractionRoleId(interaction: ButtonInteraction<CacheType>) {
        const match = /^role-([0-9]+)$/g.exec(interaction.customId);

        if (!match || match.length < 2) return null;

        return match[1];
    }

    protected async removeRole(
        roleManager: GuildMemberRoleManager,
        role: Role,
        interaction: ButtonInteraction<CacheType>,
    ) {
        await roleManager.remove(role);
        await this.giveRoleUpdateReply("Removed", role, interaction);
    }

    protected async addRole(
        roleManager: GuildMemberRoleManager,
        role: Role,
        interaction: ButtonInteraction<CacheType>,
    ) {
        await roleManager.add(role);
        await this.giveRoleUpdateReply("Added", role, interaction);
    }

    protected async giveRoleUpdateReply(prefix: string, role: Role, interaction: ButtonInteraction<CacheType>) {
        await interaction.reply({
            content: `${prefix} role ${role.name}`,
            ephemeral: true,
        });
    }
}
