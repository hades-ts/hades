import { ISerializer } from "./ISerializer"


export class JsonSerializer extends ISerializer {
    serialize(data: any): string {
        return JSON.stringify(data)
    }
    deserialize(data: string) {
        return JSON.parse(data)
    }
}