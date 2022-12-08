import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { HadesContainer } from '@hades-ts/hades';
import { installLojbanSupport } from "@hades-ts/lojban";
import { TextCommandsInstaller } from "@hades-ts/text-commands"

import { BotService } from './services/BotService';

import './text-commands';
import "@hades-ts/lojban/dist/text-commands/Lojban";
import "@hades-ts/lojban/dist/text-commands/Camxes";
import "@hades-ts/lojban/dist/text-commands/ToLojban";


((async () => {

    const container = new HadesContainer({
        installers: [
            new TextCommandsInstaller(),
            installLojbanSupport,
        ],
    });

    const bot = container.get(BotService);
    await bot.login();

})()).catch(e => { console.error(e); process.exit(1) });

