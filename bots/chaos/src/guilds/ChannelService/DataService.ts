import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import fs from "fs";
import { inject, postConstruct } from "inversify";
import path from "path";
import { z } from "zod";

const dataSchema = z.object({
    thread: z.string(),
    created: z.string().datetime(),
    text: z.string(),
    users: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            word: z.string(),
        }),
    ),
});

export type Data = z.infer<typeof dataSchema>;

@guildSingleton()
export class DataService {
    @inject("cfg.dataDirectory")
    protected dataDirectory!: string;

    @inject(guildTokens.GuildId)
    protected guildId!: string;

    @postConstruct()
    protected init() {
        this.ensureDataDirectory();
    }

    get dataFile() {
        return path.join(this.dataDirectory, `${this.guildId}.json`);
    }

    protected ensureDataDirectory() {
        if (!fs.existsSync(this.dataDirectory)) {
            fs.mkdirSync(this.dataDirectory, { recursive: true });
        }
    }

    getData(): Data | null {
        if (!fs.existsSync(this.dataFile)) {
            return null;
        }

        const data = fs.readFileSync(this.dataFile, "utf-8");
        return dataSchema.parse(JSON.parse(data));
    }

    saveData(data: Data) {
        this.ensureDataDirectory();
        fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 4));
    }

    clearData() {
        if (fs.existsSync(this.dataFile)) {
            fs.unlinkSync(this.dataFile);
        }
    }
}
