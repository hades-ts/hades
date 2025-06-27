import { HadesClient } from "@hades-ts/hades";
import {
    arg,
    command,
    completer,
    type ICompleter,
    SlashCommand,
} from "@hades-ts/slash-commands";
import {
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    type GuildMember,
    type GuildMemberRoleManager,
} from "discord.js";
import { inject, injectable } from "inversify";

import type { Config } from "../config";
import { GuildServiceFactory } from "../services";

@injectable()
class RoleCompleter implements ICompleter {
    @inject(AutocompleteInteraction)
    protected interaction!: AutocompleteInteraction;

    @inject(`cfg`)
    protected config!: Config;

    @inject(GuildServiceFactory)
    protected guildServiceFactory!: GuildServiceFactory;

    async complete(value: string) {
        const guild = this.interaction.guild!;
        const guildService =
            await this.guildServiceFactory.getGuildService(guild);
        const choices = guildService.roles.stash
            .index()
            .map((key) => guildService.roles.stash.get(key))
            .map((role) => {
                return {
                    name: `${role.title}: ${role.description}`,
                    value: role.id,
                };
            });

        if (value.trim() === "") {
            return choices;
        }

        const filteredChoices = choices.filter((choice) => {
            return choice.name.toLowerCase().includes(value.toLowerCase());
        });

        return filteredChoices;
    }
}

@command("toggle-role", { description: "Toggle a server role." })
export class ToggleRoleCommand extends SlashCommand {
    @arg({
        description: "The role to toggle.",
        type: ApplicationCommandOptionType.String,
        required: true,
    })
    @completer(RoleCompleter)
    role!: string;

    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(GuildServiceFactory)
    protected guildServiceFactory!: GuildServiceFactory;

    protected async reject(content: string) {
        try {
            await this.interaction.deferReply({
                ephemeral: true,
            });
            await this.interaction.editReply({
                content,
            });
        } catch (error) {
            console.error(`Couldn't reply to user:`, error);
        }
    }

    protected memberHasRole(member: GuildMember): boolean {
        let hasRole = false;

        for (const [_key, role] of Array.from(member.roles.cache.entries())) {
            if (this.role === role.name) {
                hasRole = true;
                break;
            }
        }

        return hasRole;
    }

    protected async addRole(
        roleManager: GuildMemberRoleManager,
        roleId: string,
    ) {
        await roleManager.add(roleId);
        await this.giveRoleUpdateReply("added");
    }

    protected async removeRole(
        roleManager: GuildMemberRoleManager,
        roleId: string,
    ) {
        await roleManager.remove(roleId);
        await this.giveRoleUpdateReply("removed");
    }

    protected async giveRoleUpdateReply(action: string) {
        await this.reply(`Role <@&${this.role}> ${action}.`, {
            ephemeral: true,
        });
    }

    async execute(): Promise<void> {
        const guildService = await this.guildServiceFactory.getGuildService(
            this.interaction.guild!,
        );
        const roleInfo = guildService.roles.stash.get(this.role);

        const guild = await this.client.guilds.fetch(this.interaction.guildId!);
        const member = await guild.members.fetch(this.interaction.user.id);

        const roleManager = member.roles;

        const hasRole = this.memberHasRole(member);

        if (hasRole) {
            await this.removeRole(roleManager, roleInfo.roleId);
        } else {
            await this.addRole(roleManager, roleInfo.roleId);
        }
    }
}
