import { inject, injectable, injectFromBase } from "inversify";

import { type LogLevel, ProxyLogger } from "@hades-ts/logging";

import { GuildInfo } from "../GuildManager";

@injectable()
@injectFromBase({
    extendConstructorArguments: false,
    extendProperties: true,
})
export class GuildProxyLogger extends ProxyLogger {
    @inject(GuildInfo)
    guildInfo!: GuildInfo;

    override meta(level: LogLevel, meta?: Record<string, any>) {
        console.log(`logger meta: ${JSON.stringify(meta)}`);
        return {
            ...super.meta(level, meta),
            guildId: this.guildInfo.id,
        };
    }
}
