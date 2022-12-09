import { Container, injectable } from 'inversify';

import { SlashArgInstaller } from '../services/SlashCommandFactory/SlashArgInstaller';
import { addSlashArgValidator } from '../metadata';
import { Constructable } from "@hades-ts/hades";
import { BaseCommandInteraction } from 'discord.js';


/**
 * Base class for reusable argument validators.
 */
@injectable()
export class Validator {
    public async validate(arg: SlashArgInstaller, ctx: BaseCommandInteraction, value: any): Promise<any> {
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
