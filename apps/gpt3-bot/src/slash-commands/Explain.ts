import { HadesClient } from "@hades-ts/hades";
import { user, command, SlashCommand, SlashArgError, arg } from "@hades-ts/slash-commands";
import { validate } from "@hades-ts/slash-commands";
import { GuildMember, MessageEmbed } from "discord.js";
import { inject } from "inversify";
import { join } from "path";
import { OpenAIClient } from "../services/OpenAIClient";



@command("explain", { description: "Ask the bot a question." })
export class ExplainCommand extends SlashCommand {

    @inject(HadesClient)
    client: HadesClient;

    @inject(OpenAIClient)
    openai: OpenAIClient;

    @arg({ description: "Your question.", type: "STRING" })
    question: string;

    async execute() {
        await this.interaction.deferReply();
        const response = await this.openai.tryCompletion(`
Q: ${this.question}
A:`);
        const embed = new MessageEmbed()
            .setTitle(`${this.interaction.user.username} asked:`)
            .setDescription(`\`\`\`
${this.question}
\`\`\`
**GPT3 Says:**
${response}`)
        await this.interaction.editReply({ embeds: [embed] });
    }
}