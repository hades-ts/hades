import { Constructable } from "@hades-ts/hades"
import { CommandInteraction } from 'discord.js'
import { Container, injectable } from 'inversify'

import { addSlashArgValidator } from '../metadata'
import { SlashArgInstaller } from '../services'


/**
 * Base class for reusable argument validators.
 */
@injectable()
export class Validator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async validate(arg: SlashArgInstaller, ctx: CommandInteraction, value: any): Promise<any> {
        return
    }

    static check() {
        return ({ constructor }: Constructable, key: string) => {
            addSlashArgValidator(constructor, key, (container: Container) => {
                container
                    .bind(Validator)
                    .to(this)
                    .whenTargetNamed(key)
            })
        }
    }
}
