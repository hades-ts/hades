import fs from 'fs';
import path from 'path';
import { inject } from "inversify";
import { z } from "zod";
import { tokens } from '../tokens';
import { guildRequest } from '../decorators';


const dataSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    text: z.string(),
    users: z.array(z.string()),
})

type Data = z.infer<typeof dataSchema>


@guildRequest()
export class DataService {

    @inject('cfg.dataDirectory')
    dataDirectory: string;

    @inject(tokens.GuildId)
    guildId: string;

    get dataFile() {
        return path.join(this.dataDirectory, `${this.guildId}.json`);
    }

    protected ensureDataDirectory() {
        if (!fs.existsSync(this.dataDirectory)) {
            fs.mkdirSync(this.dataDirectory, { recursive: true });
        }
    }

    getData(): Data {
        if (!fs.existsSync(this.dataFile)) {
            return null;
        }

        const data = fs.readFileSync(this.dataFile, 'utf-8');
        return dataSchema.parse(JSON.parse(data));
    }

    saveData(data: Data) {
        this.ensureDataDirectory();
        fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 4));
    }

    // protected getRecord(guild: string) {
    //     const data = this.getData();
    //     return data[guild] || {
    //         text: '',
    //         users: [],
    //     };
    // }

    // protected saveRecord(guild: string, record: Data) {
    //     const data = this.getData();
    //     data[guild] = record;
    //     this.saveData(data);
    // }

    // getText(guild: string) {
    //     return this.getRecord(guild).text;
    // }

    // setText(guild: string, text: string) {
    //     const record = this.getRecord(guild);
    //     record.text = text;
    //     this.saveRecord(guild, record);
    // }

    // getUsers(guild: string) {
    //     return this.getRecord(guild).users;
    // }

    // addUser(guild: string, user: string) {
    //     const record = this.getRecord(guild);
    //     record.users.push(user);
    //     this.saveRecord(guild, record);
    // }

    // resetGuild(guild: string) {
    //     const data = this.getData();
    //     delete data[guild];
    //     this.saveData(data);
    // }   

}