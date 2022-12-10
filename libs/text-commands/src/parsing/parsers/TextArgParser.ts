import { injectable } from "inversify";
import { TextArgInstaller, TextCommandContext } from "../../commands";


@injectable()
export class TextArgParser {
    name: string;
    description: string;

    async parse(arg: TextArgInstaller, context: TextCommandContext): Promise<any> { }
}
