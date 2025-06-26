import { inject } from "inversify";

import { getListenerMetas, type SI, singleton } from "../decorators";
import { HadesClient } from "./HadesClient";

/**
 * A callback service for Discord events.
 */
@singleton(EventService, false)
export abstract class EventService {
    @inject(HadesClient)
    protected client!: HadesClient;

    /**
     * Register a bot for event callbacks.
     * @param bot The bot to register callbacks for.
     */
    register(bot: object) {
        const metas = getListenerMetas();

        let ctor = Object.getPrototypeOf(bot).constructor;

        while (ctor !== Object.prototype) {
            const meta = metas.get(ctor as SI);

            if (meta === undefined) {
                return;
            }

            for (const methodMeta of meta.methods.values()) {
                const method = bot[methodMeta.name as keyof typeof bot] as (
                    ...args: any[]
                ) => void;

                if (method === undefined) {
                    throw new Error(
                        `Method ${methodMeta.name} not found on ${bot.constructor.name}`,
                    );
                }

                const event = methodMeta.event;
                this.client.on(event, method.bind(bot));
            }

            ctor = Object.getPrototypeOf(ctor);
        }
    }
}
