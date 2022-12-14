import fs from 'fs';

import { inject } from "inversify";

import { singleton } from "@hades-ts/hades";

import { ConfigGuild } from "../config";


export class NoPromptConfiguredError extends Error {
    constructor(guildId: string) {
        super(`No prompt configured for guild ${guildId}`);
    }
}

@singleton(PromptService)
export class PromptService {

    @inject('cfg.guilds')
    configGuilds: Record<string, ConfigGuild>;

    protected readPrompt(filename: string) {
        return fs.readFileSync(filename, 'utf-8');
    }

    getPrompt(guildId: string) {
        const guildConfig = this.configGuilds[guildId];
        if (!guildConfig) {
            throw new NoPromptConfiguredError(guildId);
        }
        return this.readPrompt(guildConfig.prompt);
    }
    
}