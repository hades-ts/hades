import { ApplicationCommandOptionType } from "discord.js";
import { arg, command, SlashCommand } from "@hades-ts/slash-commands";
import { inject } from "inversify";
import { CamxesService } from "../services/CamxesService";
import { HadesClient } from "@hades-ts/hades";

@command("genturba'a", { description: "jarco le genturba'a lo jufra" })
export class Genturbaha extends SlashCommand {
    @inject(HadesClient)
    client: HadesClient;

    @arg({ description: "jufra", type: ApplicationCommandOptionType.String })
    phrase: string;

    @inject(CamxesService)
    camxes: CamxesService;

    async execute() {
        const parsed = this.camxes.getParse(this.phrase);
        this.reply(`\`\`\`\n${parsed}\`\`\`\n`);
    }
}
