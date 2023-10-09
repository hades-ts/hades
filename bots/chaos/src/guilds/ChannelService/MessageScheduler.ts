import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { inject } from "inversify";
import { DateTime } from "luxon";

import { GuildConfig } from "../../config";
import { WithRequired } from "../../types";
import { MessageSender } from "./MessageSender";
import { RolloverService } from "./RolloverService";

@guildSingleton()
export class MessageScheduler {
    @inject(guildTokens.GuildId)
    private guildId!: string;

    @inject(guildTokens.GuildConfig)
    private config!: WithRequired<GuildConfig, "channel">;

    @inject(MessageSender)
    private sender!: MessageSender;

    @inject(RolloverService)
    private rolloverService!: RolloverService;

    protected schedule(dateTime: DateTime, callback: () => void) {
        const now = DateTime.local();
        const delay = dateTime.diff(now).as("milliseconds");
        setTimeout(callback, delay);
    }

    protected async createMessage(datetime?: DateTime) {
        await this.sender.createMessage(datetime);
        this.scheduleNextMessage();
    }

    async checkRollover() {
        const rolloverStatus = await this.rolloverService.checkRollover();
        switch (rolloverStatus.type) {
            case "empty":
                await this.createMessage();
                break;
            case "passed":
                await this.createMessage(rolloverStatus.changeOver);
                break;
            case "scheduled":
                this.schedule(
                    rolloverStatus.changeOver.plus({
                        seconds: 10,
                    }),
                    () => this.checkRollover(),
                );
                break;
        }
    }

    scheduleNextMessage(datetime?: DateTime) {
        console.log(`[ChannelManager] Scheduling next message for guild ${this.guildId}`);
        const period = this.config.channel.period || { days: 1 };
        const basis = datetime || DateTime.now();
        this.schedule(basis.toUTC().plus(period), () => this.checkRollover());
    }
}
