import { Container, inject } from "inversify";

import { type ILogger, logger } from "@hades-ts/logging";

import { getListenerMetas, type SI, singleton } from "../decorators";
import { HadesClient } from "../services/HadesClient";

export abstract class IEventService {
    abstract register(bot: object): void;
}

/**
 * A callback service for Discord events.
 */
@singleton()
export class EventService implements IEventService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @logger("EventService")
    protected log!: ILogger;

    @inject(Container)
    protected container!: Container;

    /**
     * Register a bot for event callbacks.
     * @param bot The bot to register callbacks for.
     */
    register(bot: object) {
        const metas = getListenerMetas();

        let ctor = Object.getPrototypeOf(bot).constructor;

        this.log.info(`Registering event handlers.`, {
            target: bot.constructor.name,
        });

        while (ctor !== Object.prototype) {
            const meta = metas.get(ctor as SI);

            if (meta === undefined) {
                return;
            }

            for (const methodMeta of meta.methods.values()) {
                this.log.debug(`Registering event handler.`, {
                    target: bot.constructor.name,
                    method: methodMeta.name,
                    event: methodMeta.event,
                });

                const method = bot[methodMeta.name as keyof typeof bot] as (
                    ...args: any[]
                ) => void;

                if (method === undefined) {
                    this.log.error(`Event handler method not found.`, {
                        target: bot.constructor.name,
                        method: methodMeta.name,
                        event: methodMeta.event,
                    });
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
