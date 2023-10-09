import { inject, injectable } from "inversify";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand, arg, resolver } from "@hades-ts/slash-commands";
import { LookupService } from "../services";

@injectable()
class KardaResolver {
    @inject(LookupService)
    lookupService!: LookupService;

    getChoices() {
        const choices = this.lookupService.all().map((fact) => {
            return {
                name: `${fact.name}: ${fact.description}`,
                value: fact.id,
            };
        });

        return choices;
    }
}

@command("karda", { description: "Look up some Lojban grammar." })
export class KardaCommand extends SlashCommand {
    @arg({
        description: "Which grammar factoid.",
        type: ApplicationCommandOptionType.String,
        required: true,
    })
    @resolver(KardaResolver)
    fact!: string;

    @inject(HadesClient)
    client!: HadesClient;

    @inject(LookupService)
    lookupService!: LookupService;

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
        const fact = this.lookupService.get(this.fact);

        this.interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${fact.name}: ${fact.description}`)
                    .setDescription(fact.content)
                    .setImage("https://i.stack.imgur.com/Fzh0w.png"),
            ],
        });
    }
}
