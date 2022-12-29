import fs from 'node:fs'

import { singleton } from '@hades-ts/hades'
import { inject } from 'inversify'
import path from 'path'

import { NoSuchRecordError } from '../errors/NoSuchRecordError'
import { ISerializer, JsonSerializer } from '../serializers'


@singleton(FileReader)
export class FileReader {

    @inject('file.rootPath')
    protected rootPath!: string

    @inject('file.extension')
    protected extension = 'json'

    @inject('file.serializer')
    protected serializer: ISerializer = new JsonSerializer()

    protected getFilePath(id: string) {
        return path.join(this.rootPath, `${id}.${this.extension}`)
    }

    public exists(id: string) {
        const filename = this.getFilePath(id)
        return fs.existsSync(filename)
    }

    public get<T>(id: string): T {
        const filename = this.getFilePath(id)

        if (!fs.existsSync(filename)) {
            throw new NoSuchRecordError(`No such record: ${id}`)
        }

        const text = fs.readFileSync(filename, 'utf-8')
        const data = this.serializer.deserialize(text)
        return data as T
    }
}