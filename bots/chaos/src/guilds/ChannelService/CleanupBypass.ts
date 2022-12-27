import { guildSingleton } from "@hades-ts/guilds"
import { inject } from "inversify"


@guildSingleton()
export class CleanupBypass {

    @inject('cfg.botOwner')
    protected botOwner!: string

    isExempt(authorId: string) {
        if (authorId === this.botOwner) {
            return true
        }
    }
}