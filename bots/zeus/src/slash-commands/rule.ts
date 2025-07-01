import { HadesClient } from "@hades-ts/core";
import {
    arg,
    command,
    completer,
    type ICompleter,
    SlashCommand,
} from "@hades-ts/slash-commands";
import type { MarkdownStashData, Record } from "@hades-ts/stash";
import {
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    EmbedBuilder,
} from "discord.js";
import { inject, injectable } from "inversify";
import type { RuleConfig } from "../config";
import { GuildServiceFactory } from "../services";

@injectable()
class RuleCompleter implements ICompleter {
    @inject(AutocompleteInteraction)
    protected interaction!: AutocompleteInteraction;

    @inject(GuildServiceFactory)
    protected guildServiceFactory!: GuildServiceFactory;

    protected tokenize(rule: RuleConfig) {
        const titleTokens = rule.title.toLowerCase().split(/\s+/);
        const descriptionTokens = rule.description.toLowerCase().split(/\s+/);
        return titleTokens.concat(descriptionTokens);
    }

    protected compare(tokens: string[], searchTokens: string[]) {
        return searchTokens.every((searchToken) =>
            tokens.some((token) => token.includes(searchToken)),
        );
    }

    protected makeChoices(rules: Array<Record<MarkdownStashData<RuleConfig>>>) {
        return rules.map(({ data, id }) => ({
            name: `${data.data.title}: ${data.data.description}`,
            value: id,
        }));
    }

    async complete(value: string) {
        const guildService = await this.guildServiceFactory.getGuildService(
            this.interaction.guild!,
        );
        const rules = guildService.rules.stash.filter(
            (rule: MarkdownStashData<RuleConfig>) => {
                if (value.trim() === "") {
                    return true;
                }
                const tokens = this.tokenize(rule.data);
                const searchTokens = value.split(/\s+/);
                return this.compare(tokens, searchTokens);
            },
        );

        return this.makeChoices(rules);
    }
}

@command("rule", { description: "Reference a server rule." })
export class RuleCommand extends SlashCommand {
    @arg({
        description: "The rule number.",
        type: ApplicationCommandOptionType.String,
        required: true,
    })
    @completer(RuleCompleter)
    rule!: string;

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

    async execute(): Promise<void> {
        const guildService = await this.guildServiceFactory.getGuildService(
            this.interaction.guild!,
        );
        const rule = await guildService.rules.stash.get(this.rule);

        if (!rule) {
            await this.reject(`Hmm, couldn't find that rule!`);
            return;
        }

        const embed = rule.data.data;

        await this.interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(embed.title)
                    .setDescription(embed.content)
                    .setFooter({
                        text: embed.description,
                    }),
            ],
        });
    }
}
