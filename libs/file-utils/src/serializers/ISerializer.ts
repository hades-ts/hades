
export abstract class ISerializer {
    abstract serialize(data: any): string
    abstract deserialize(data: string): any
}