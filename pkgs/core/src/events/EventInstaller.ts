import type { Container } from "inversify";

import { findListeners } from "../decorators/listener";
import { EventService, IEventService } from "./EventService";

export const withEvents = () => (container: Container) => {
    if (!container.isBound(IEventService)) {
        container.bind(IEventService).to(EventService).inSingletonScope();
    }
    const listeners = findListeners();
    for (const [_name, data] of listeners) {
        const listenerClass = data.target as any;
        container.onActivation(listenerClass, (_context, instance) => {
            const es = container.get(IEventService);
            es.register(instance as any);
            return instance;
        });
    }
};
