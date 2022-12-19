import { inject } from "inversify";
import { guildSingleton } from "../decorators";
import { tokens } from "../tokens";


@guildSingleton()
export class CleanupBypass {

    @inject('cfg.botOwner')
    protected botOwner!: string;

    @inject(tokens.GuildOwner)
    protected guildOwner!: string;

    isExempt(authorId: string) {
        if (authorId === this.botOwner) {
            return true;
        }

        if (authorId === this.guildOwner) {
            return true;
        }
    }
}