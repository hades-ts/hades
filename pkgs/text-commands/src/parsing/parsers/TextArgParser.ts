import { injectable } from "inversify";

import { TextArgInstaller, TextCommandContext } from "../../commands";

@injectable()
export class TextArgParser {
    name: string;
    description: string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async parse(arg: TextArgInstaller, context: TextCommandContext): Promise<any> {}
}
