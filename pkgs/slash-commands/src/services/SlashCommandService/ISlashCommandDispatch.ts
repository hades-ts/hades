import type { CommandInteraction } from "discord.js";
import { injectable } from "inversify";

@injectable()
export abstract class ISlashCommandDispatch {
    abstract dispatch(interaction: CommandInteraction): Promise<void>;
}
