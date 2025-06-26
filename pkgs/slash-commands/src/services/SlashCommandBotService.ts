import { HadesBotService, listenFor } from "@hades-ts/hades";
import { type BaseInteraction, Events } from "discord.js";
import { inject, injectable, injectFromBase } from "inversify";
import { SlashCommandService } from "./SlashCommandService";

@injectable()
@injectFromBase({
    extendConstructorArguments: false,
    extendProperties: true,
})
export class SlashCommandBotService extends HadesBotService {
    @inject(SlashCommandService)
    protected commandService!: SlashCommandService;

    async onReady() {
        await this.commandService.registerCommands(this.client);
    }

    @listenFor(Events.InteractionCreate)
    async onInteractionCreate(interaction: BaseInteraction) {
        if (interaction.isCommand()) {
            await this.commandService.dispatch(interaction);
        }
    }
}
