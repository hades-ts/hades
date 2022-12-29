import { ISerializer } from "./ISerializer"


export class JsonSerializer extends ISerializer {

    public serialize(data: any): string {
        return JSON.stringify(data)
    }

    public deserialize(data: string) {
        return JSON.parse(data)
    }
}