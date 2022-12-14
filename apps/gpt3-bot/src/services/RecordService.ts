import fs from 'fs'
import path from 'path'

import { HadesClient, singleton } from "@hades-ts/hades";
import { inject, postConstruct } from "inversify";
import { Subject } from 'rxjs';
import { Transcript, TranscriptMessage } from '../types';


export const RecordServiceTokens = {
    RecordUpdated: Symbol.for('RecordUpdated')
}

@singleton(RecordService)
export class RecordService {

    @inject(HadesClient)    
    client: HadesClient;

    @inject('cfg.transcriptsPath')
    dataDir: string;

    _recordUpdated: Subject<Transcript>;

    @postConstruct() 
    init() {
        this._recordUpdated = new Subject<Transcript>();
    }

    get recordUpdated() { return this._recordUpdated }

    protected ensureDataDir() {
        // ensure the data directory exists
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

    saveThread(thread: Transcript) {

        if (thread.threadId === undefined) {
            throw new Error('Cannot save thread without threadId');
        }

        this.ensureGuildDir(thread.guildId);
        // save a transcript
        const threadPath = path.join(this.dataDir, thread.guildId, thread.threadId);
        fs.writeFileSync(threadPath, JSON.stringify(thread, null, 4));
        this._recordUpdated.next(thread);
    }

    addMessage(guildId: string, threadId: string, message: TranscriptMessage) {
        this.ensureGuildDir(guildId);
        const thread = this.getThread(guildId, threadId);
        thread.messages.push(message);
        this.saveThread(thread);
    }

    getThread(guildId: string, threadId: string | undefined): Transcript {
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
