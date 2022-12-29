import fs from 'node:fs'

import { singleton } from '@hades-ts/hades'


@singleton(FileWriter)
export class FileWriter {

    public ensureDirectory(dir: string) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
    }

    public write<T>(file: string, data: T) {
        fs.writeFileSync(file, JSON.stringify(data, null, 4))
    }
}