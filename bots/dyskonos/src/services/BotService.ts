import { Events } from "discord.js";
import { inject } from "inversify";

import { HadesClient, listener, listenFor, singleton } from "@hades-ts/core";
import { type ILogger, logger } from "@hades-ts/logging";

@listener()
@singleton()
export class BotService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @logger("BotService")
    protected log!: ILogger;

    @logger("Debug")
    protected debugLog!: ILogger;

    @listenFor(Events.ClientReady)
    async onReady(): Promise<void> {
        this.log.info("Dyskonos is ready!");
    }

    @listenFor(Events.Debug)
    async onDebug(message: string) {
        this.debugLog.debug(message);
    }
}
