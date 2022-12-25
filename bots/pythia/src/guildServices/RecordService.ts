import fs from 'fs'
import path from 'path'

import { HadesClient } from "@hades-ts/hades";
import { inject } from "inversify";
import { Thread } from '../types';
import { guildSingleton } from '@hades-ts/guilds';


export const RecordServiceTokens = {
    RecordUpdated: Symbol.for('RecordUpdated')
}

@guildSingleton()
export class RecordService {

    @inject(HadesClient)
    client!: HadesClient;

    @inject('cfg.transcriptsPath')
    dataDir!: string;

    protected ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir);
        }
    }

    protected ensureGuildDir(guildId: string) {
        this.ensureDataDir();
        const guildDir = path.join(this.dataDir, guildId);
        if (!fs.existsSync(guildDir)) {
            fs.mkdirSync(guildDir);
        }
    }

    saveThread(thread: Thread) {

        if (thread.threadId === undefined) {
            throw new Error('Cannot save thread without threadId');
        }

        this.ensureGuildDir(thread.guildId);
        const threadPath = path.join(this.dataDir, thread.guildId, thread.threadId);
        fs.writeFileSync(threadPath, JSON.stringify(thread, null, 4));
    }

    getThread(guildId: string, threadId: string | undefined): Thread {
        this.ensureGuildDir(guildId);

        if (threadId === undefined) {
            return {
                guildId,
                threadId,
                messages: [],
            }
        }

        const threadPath = path.join(this.dataDir, guildId, threadId);

        if (!fs.existsSync(threadPath)) {
            return {
                guildId,
                threadId,
                messages: [],
            };
        }

        const thread = JSON.parse(fs.readFileSync(threadPath, 'utf8'));
        return thread;
    }

    deleteThread(guildId: string, threadId: string) {
        const threadPath = path.join(this.dataDir, guildId, threadId);
        if (!fs.existsSync(threadPath)) {
            return;
        }
        fs.unlinkSync(threadPath);
    }

}
