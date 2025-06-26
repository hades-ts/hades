import { inject, injectable, postConstruct } from "inversify";

import { EventService } from "./EventService";
import { HadesClient } from "./HadesClient";

/**
 * A base service for building bots with Hades.
 *
 * Comes with a HadesClient and EventService. The bot will automatically
 * register with the EventService.
 */
@injectable()
export class HadesBotService {
    /**
     * The Discord client.
     */
    @inject(HadesClient)
    protected client!: HadesClient;

    /**
     * The Discord bot token.
     */
    @inject("cfg.discordToken")
    protected token!: string;

    /**
     * Used to receive Discord events.
     */
    @inject(EventService)
    protected eventService!: EventService;

    /**
     * Connect to Discord.
     * @returns Promise<string>
     */
    async login() {
        console.log("----- login");
        return this.client.login(this.token.toString());
    }

    get highlight() {
        return `<@${this.client.user?.id}>`;
    }

    protected isHighlight(content: string) {
        return content.startsWith(this.highlight);
    }
}
