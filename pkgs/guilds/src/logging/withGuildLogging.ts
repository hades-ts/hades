import type { Container } from "inversify";

import {
    type LoggingOptions,
    ProxyLogger,
    withLogging,
} from "@hades-ts/logging";

import { GuildProxyLogger } from "./GuildProxyLogger";

export const withGuildLogging =
    (options: LoggingOptions) => (container: Container) => {
        container.bind(ProxyLogger).to(GuildProxyLogger).inTransientScope();
        withLogging(options)(container);
    };
