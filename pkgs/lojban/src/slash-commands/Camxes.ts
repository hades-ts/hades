import { ApplicationCommandOptionType } from "discord.js";
import { inject } from "inversify";

import { HadesClient } from "@hades-ts/core";
import { arg, command, SlashCommand } from "@hades-ts/slash-commands";

import { CamxesService } from "../services/CamxesService";

@command("genturba'a", { description: "jarco le genturba'a lo jufra" })
export class Genturbaha extends SlashCommand {
    @inject(HadesClient)
    client!: HadesClient;

    @arg({ description: "jufra", type: ApplicationCommandOptionType.String })
    phrase!: string;

    @inject(CamxesService)
    camxes!: CamxesService;

    async execute() {
        const parsed = this.camxes.getParse(this.phrase);
        this.reply(`\`\`\`\n${parsed}\`\`\`\n`);
    }
}
