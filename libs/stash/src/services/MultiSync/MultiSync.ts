import path from "path";

import { HadesClient } from "@hades-ts/hades";
import { ChannelSync } from "../ChannelSync";


export class MultiSync {

    protected channels: Array<ChannelSync> = [];

    constructor(
        protected client: HadesClient,
        protected dataPath: string,
        channels: Record<string, string>,
    ) { 
        for (const [channelId, stashPath] of Object.entries(channels)) {
            this.channels.push(new ChannelSync(
                this.client,
                channelId,
                path.join(this.dataPath, stashPath),
            ));
        }
    }

    async sync() {
        for (const channel of this.channels) {
            await channel.sync();
        }
    }
}