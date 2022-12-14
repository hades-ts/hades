import { arg, command, description, TextCommand } from "@hades-ts/text-commands";
import { inject } from "inversify";
import { CamxesService } from "../services/CamxesService";

@command("markup")
@description("Markup jufra (Lojban sentences).")
export class Camxes extends TextCommand {
  @arg()
  @description("String to markup.")
  phrase!: string;

  @inject(CamxesService)
  camxes: CamxesService;

  async execute() {
    const parsed = this.camxes.getParse(this.phrase);
    this.reply(`\`\`\`\n${parsed}\`\`\`\n`);
  }
}
