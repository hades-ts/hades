import type { Container } from "inversify";
import { findListeners } from "../decorators/listener";
import { EventService } from "./EventService";

export const withEvents = (container: Container) => {
    const es = container.get(EventService);
    const listeners = findListeners();
    for (const [_name, data] of listeners) {
        const listenerClass = data.target as any;
        container.onActivation(listenerClass, (_context, instance) => {
            es.register(instance as any);
            return instance;
        });
    }
};
