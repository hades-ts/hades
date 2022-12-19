import { inject, injectable } from "inversify";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand, arg, resolver } from "@hades-ts/slash-commands";
import { ConfigGuild } from "../config";

@injectable()
class RuleResolver {

    getChoices() {
        return [
            { name: "Rule 1", value: "1" },
            { name: "Rule 2", value: "2" },
            { name: "Rule 3", value: "3" },
        ]
    }
}

@command("rule", { description: "Reference a server rule." })
export class RuleCommand extends SlashCommand {

    @arg({ 
        description: "Which rule.", 
        type: ApplicationCommandOptionType.String, 
        required: true 
    })
    @resolver(RuleResolver)
    rule!: string;

    @inject('cfg.guilds')
    configGuilds!: Record<string, ConfigGuild>;

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
        const guildId = this.interaction.guildId!;
        const guildConfig = this.configGuilds[guildId];
        
        if (!guildConfig) {
            await this.reject("Sorry, I'm not set up for this guild yet. Try again later!");
            return;
        }

        if (guildConfig.disabled) {
            await this.reject("Sorry, I'm disabled in this server at the moment.");
            return;
        }
        
        const ruleData = guildConfig.rules[Number(this.rule) - 1];

        this.interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Rule #${this.rule}: ${ruleData.name}`)
                    .setDescription(ruleData.description)
            ]
        });

    }

}