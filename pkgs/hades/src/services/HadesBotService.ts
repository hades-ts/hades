import { inject, injectable } from "inversify";
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
}
// TODO: DELETE THIS FILE
