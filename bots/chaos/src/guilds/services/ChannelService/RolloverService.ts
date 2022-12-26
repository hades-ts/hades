import { inject } from "inversify"
import { DateTime } from "luxon"

import { ConfigGuild } from "../../../config"
import { WithRequired } from "../../../types"
import { guildSingleton } from "../../decorators"
import { tokens } from "../../tokens"
import { Data, DataService } from "./DataService"


export type EmptyRollover = {
    type: 'empty';
}

export type PassedRollover = {
    type: 'passed';
    changeOver: DateTime;
}

export type ScheduledRollover = {
    type: 'scheduled';
    changeOver: DateTime;
}

export type RolloverStatus = EmptyRollover | PassedRollover | ScheduledRollover;

@guildSingleton()
export class RolloverService {

    @inject(tokens.GuildConfig)
    private config!: WithRequired<ConfigGuild, 'channel'>

    @inject(DataService)
    private dataService!: DataService

    protected calculateChangeOver(data: Data) {
        const period = this.config.channel.period || { days: 1 }
        const { created } = data
        const dateObj = DateTime.fromISO(created).toUTC()
        return dateObj.plus(period)
    }

    protected changeOverPassed(changeOver: DateTime) {
        return changeOver < DateTime.now().toUTC()
    }

    async checkRollover(): Promise<RolloverStatus> {
        const data = this.dataService.getData()

        if (data === null) {
            return { type: 'empty' }
        }

        const changeOver = this.calculateChangeOver(data)

        if (this.changeOverPassed(changeOver)) {
            return { type: 'passed', changeOver }
        }

        return { type: 'scheduled', changeOver }
    }
}
