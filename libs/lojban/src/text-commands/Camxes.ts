import { arg, command, description, TextCommand } from "@hades-ts/text-commands";
import { inject } from "inversify";

import { CamxesService } from "../services/CamxesService";

@command("markup")
@description("Markup jufra (Lojban sentences).")
export class Camxes extends TextCommand {
    @arg()
    @description("String to markup.")
    protected phrase!: string;

    @inject(CamxesService)
    protected camxes: CamxesService;

    async execute() {
        const parsed = this.camxes.getParse(this.phrase);
        await this.reply(`\`\`\`\n${parsed}\`\`\`\n`);
    }
}
