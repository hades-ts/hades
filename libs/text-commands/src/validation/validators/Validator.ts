import { Constructable } from "@hades-ts/hades";
import { Container, injectable } from "inversify";

import { TextArgInstaller, TextCommandContext } from "../../commands";
import { addTextArgValidator } from "../metadata";

/**
 * Base class for reusable argument validators.
 */
@injectable()
export class Validator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async validate(arg: TextArgInstaller, ctx: TextCommandContext, value: any): Promise<any> {
        return;
    }

    static check() {
        return ({ constructor }: Constructable, key: string) => {
            addTextArgValidator(constructor, key, (container: Container) => {
                container.bind(Validator).to(this).whenTargetNamed(key);
            });
        };
    }
}
