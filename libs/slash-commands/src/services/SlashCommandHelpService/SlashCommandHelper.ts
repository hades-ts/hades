import { Collection, EmbedBuilder } from "discord.js";

import { SlashArgMeta, SlashCommandMeta } from "../../metadata";

/**
 * Extracts help information from a command meta.
 */
export class SlashCommandHelper {
    // eslint-disable-next-line no-useless-constructor
    constructor(private meta: SlashCommandMeta) {}

    get name() {
        return this.meta.name.trim();
    }
    get args(): Collection<string, SlashArgMeta> {
        return this.meta.args;
    }
    get target() {
        return this.meta.target;
    }
    get description() {
        return this.meta.description?.trim();
    }

    getArgTags() {
        return this.args.map((a) => `[*${a.name}*]`);
    }

    getArgUsage() {
        return this.getArgTags().join(" ");
    }

    getUsage() {
        return `**${this.name} ${this.getArgUsage()}** `;
    }

    getArgFields() {
        return this.args.map((arg: SlashArgMeta) => {
            // TODO: figure out how to get at parser for arg (ParserRegistry?)
            const parserType = arg.parserType?.name || "string";
            const description = arg.description || /* arg.parser.description || */ "";
            const value = `*${parserType}*\n${description} `.trim();
            return { name: arg.name, value };
        });
    }

    public getHelpEmbed() {
        let desc = this.getUsage();

        if (this.description) {
            desc = desc + "\n" + this.description;
        }

        const embed = new EmbedBuilder().setDescription(desc).addFields(this.getArgFields());
        return embed;
    }
}
