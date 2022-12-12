import { arg, command, description, TextCommand } from "@hades-ts/text-commands";
import { inject } from "inversify";
import { CamxesService } from "../services";

@command("camxes")
@description("Get parse of lojban sentence.")
export class Camxes extends TextCommand {
    @arg()
    @description("String to parse.")
    phrase!: string;

    @inject(CamxesService)
    camxes: CamxesService;

    async execute() {
        const parse = this.camxes.getParse(this.phrase);
        this.reply(`\`\`\`\n${parse}\n\`\`\``);
    }
}
