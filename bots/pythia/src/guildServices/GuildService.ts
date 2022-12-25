import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { inject } from "inversify";
import { GuildConfig } from "../config";
import { CompletionService } from "./CompletionService";
import { RecordService } from "./RecordService";


@guildSingleton()
export class GuildService {

    @inject(guildTokens.GuildId)
    guildId!: string;

    @inject(guildTokens.GuildConfig)
    guildConfig!: GuildConfig;

    @inject(CompletionService)
    completions!: CompletionService;

    @inject(RecordService)
    records!: RecordService;

}