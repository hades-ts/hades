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
        const meta = {} as Record<string, any>;

        if (message.includes("Provided token")) {
            return
        }

        if (message.includes("Heartbeat acknowledged")) {
            meta.heartbeat = true;
            meta.latency = null;

            const match = message.match(/latency of (\d+)ms/);
            if (match) {
                meta.latency = parseInt(match[1]);
            }
        }

        this.debugLog.debug(message, meta);
    }
}
