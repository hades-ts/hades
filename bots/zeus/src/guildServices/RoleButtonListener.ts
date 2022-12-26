import { guildSingleton, guildTokens } from "@hades-ts/guilds"
import { HadesClient } from "@hades-ts/hades"
import { inject, postConstruct } from "inversify"


@guildSingleton()
export class RoleButtonListener {

    @inject(HadesClient)
    private client!: HadesClient

    @inject(guildTokens.GuildId)
    private guildId!: string

    @postConstruct()
    protected init() {
        this.client.on('interactionCreate', async interaction => {
            const button = interaction.isButton() && interaction

            if (!button) return

            const match = /^role-([0-9]+)$/g.exec(interaction.customId)
            if (!match) return

            const roleId = match[1]
            const guild = await this.client.guilds.fetch(this.guildId)
            const role = await guild.roles.fetch(roleId)

            if (!role) return

            const member = await guild.members.fetch(interaction.user.id)

            if (!member) return

            const roleManager = member.roles

            if (roleManager.cache.has(roleId)) {
                await roleManager.remove(role)
                await interaction.reply({
                    content: `Removed role ${role.name}`,
                    ephemeral: true,
                })
            } else {
                await roleManager.add(role)
                await interaction.reply({
                    content: `Added role ${role.name}`,
                    ephemeral: true,
                })
            }
        })
    }
}