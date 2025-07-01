import type { BaseInteraction } from "discord.js";
import { injectable } from "inversify";

@injectable()
export abstract class Interaction {
    abstract execute(interaction: BaseInteraction): Promise<void>;
}
