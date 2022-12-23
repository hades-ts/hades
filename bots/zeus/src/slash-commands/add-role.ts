import { HadesClient } from "@hades-ts/hades";
import { SlashCommand, command, arg, ICompleter, completer } from "@hades-ts/slash-commands";

import { ApplicationCommandOptionType, AutocompleteInteraction, GuildMemberRoleManager } from "discord.js";
import { inject, injectable } from "inversify";
import { Config } from "../config";
import { GuildServiceFactory } from "../services";


@injectable()
class RoleCompleter implements ICompleter {

    @inject(AutocompleteInteraction)
    interaction!: AutocompleteInteraction;

    @inject(`cfg`)
    config!: Config;

    @inject(GuildServiceFactory)
    guildServiceFactory!: GuildServiceFactory;

    async complete(value: string) {
        const guild = this.interaction.guild!;
        const guildService = await this.guildServiceFactory.getGuildService(guild);
        const choices = guildService.roles.stash.index()
            .map(key => guildService.roles.stash.get(key))
            .map(role => {
            return {
                name: `<@&${role.roleId}>: ${role.description}>`,
                value: role.id,
            }
        })

        if (value.trim() === "") {
            return choices;
        }

        const filteredChoices = choices.filter(choice => {
            return choice.name.toLowerCase().includes(value.toLowerCase());
        })

        return filteredChoices;
    }
}

@command("add-role", { description: "Get a server role." })
export class AddRoleCommand extends SlashCommand {

    @arg({
        description: "The role you want.",
        type: ApplicationCommandOptionType.String,
        required: true 
    })
    @completer(RoleCompleter)
    role!: string;

    @inject(HadesClient)
    client!: HadesClient;

    protected async reject(content: string) {
        try {
            await this.interaction.deferReply({
                ephemeral: true,
            })
            await this.interaction.editReply({
                content,
            })
        } catch (error) {
            console.error(`Couldn't reply to user:`, error);
        }
    }

    async execute(): Promise<void> {
        const roleCache = this.interaction.member!.roles as GuildMemberRoleManager;
        const hasRole = roleCache.cache.has(this.role);

        if (hasRole) {
            await this.reject("You already have this role.");
            return;
        }

        await roleCache.add(this.role);

        await this.reply(`You now have the role <@&${this.role}>.`, {
            ephemeral: true,
        });
    }

}