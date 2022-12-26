import 'reflect-metadata'
import './slash-commands'
import './text-commands'

import { HadesContainer } from '@hades-ts/hades'
import { SlashCommandsInstaller } from "@hades-ts/slash-commands"
import { TextCommandsInstaller } from "@hades-ts/text-commands"
import * as dotenv from 'dotenv'

import { BotService } from './services/BotService'


dotenv.config();


((async () => {

    const container = new HadesContainer({
        installers: [
            new TextCommandsInstaller(),
            new SlashCommandsInstaller(),
        ],
    })

    const bot = container.get(BotService)
    await bot.login()

})()).catch(e => { console.error(e); process.exit(1) })

