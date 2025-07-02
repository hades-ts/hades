import { inject } from "inversify";

import { guildSingleton, guildTokens } from "@hades-ts/guilds";

import type { GuildConfig } from "../config";
import { CompletionService } from "./CompletionService";
import { RecordService } from "./RecordService";

export class GuildService {
    @inject(guildTokens.GuildId)
    public guildId!: string;

    @inject(guildTokens.GuildConfig)
    public guildConfig!: GuildConfig;

    @inject(CompletionService)
    public completions!: CompletionService;

    @inject(RecordService)
    public records!: RecordService;
}
