import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { HadesContainer } from '@hades-ts/hades';
import { TextCommandsInstaller } from "@hades-ts/text-commands"
import { SlashCommandsInstaller } from  "@hades-ts/slash-commands"


import { BotService } from './services/BotService';


import './slash-commands';

import { configSchema } from './config';
import { GuildManager } from 'discord.js';
import { interfaces } from 'inversify';

((async () => {

    const container = new HadesContainer({
        installers: [
            new TextCommandsInstaller(),
            new SlashCommandsInstaller(),
        ],
        configOptions: {
            schema: configSchema,
        }
    });

    container
        .bind(GuildManager)
        .toSelf()
        .inSingletonScope();

    const bot = container.get(BotService);
    await bot.login();

})()).catch(e => { console.error(e); process.exit(1) });

