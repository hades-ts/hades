import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { TagDb } from "@hades-ts/tags";
import { inject, postConstruct } from "inversify";
import path from "path";

@guildSingleton()
export class BanService {
    @inject("cfg.dataDirectory")
    protected dataDirectory!: string;

    @inject(guildTokens.GuildId)
    protected guildId!: string;

    public db!: TagDb;

    @postConstruct()
    protected init() {
        const dbPath = path.join(this.dataDirectory, this.guildId, "tags");
        this.db = new TagDb(dbPath);
    }
}
