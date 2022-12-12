import { Container, injectable } from 'inversify';
import { CommandInteraction } from 'discord.js';

import { Constructable } from "@hades-ts/hades";

import { SlashArgInstaller } from '../services';
import { addSlashArgValidator } from '../metadata';


/**
 * Base class for reusable argument validators.
 */
@injectable()
export class Validator {
    public async validate(arg: SlashArgInstaller, ctx: CommandInteraction, value: any): Promise<any> {
        return;
    }

    static check() {
        return ({ constructor }: Constructable, key: string) => {
            addSlashArgValidator(constructor, key, (container: Container) => {
                container
                    .bind(Validator)
                    .to(this)
                    .whenTargetNamed(key);
            });
        }
    }
}
