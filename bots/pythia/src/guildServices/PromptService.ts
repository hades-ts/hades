import fs from "fs";

import { inject } from "inversify";

import { guildSingleton, guildTokens } from "@hades-ts/guilds";

import type { GuildConfig } from "../config";

export class NoPromptConfiguredError extends Error {
    constructor(guildId: string) {
        super(`No prompt configured for guild ${guildId}`);
    }
}

@guildSingleton()
export class PromptService {
    @inject(guildTokens.GuildConfig)
    protected config!: GuildConfig;

    protected readPrompt(filename: string) {
        return fs.readFileSync(filename, "utf-8");
    }

    getPrompt() {
        // return this.readPrompt(this.config.prompt);
    }
}
