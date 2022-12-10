import { TextArgInstaller, TextCommandContext } from "../../commands";
import { parser } from "../decorators";
import { TextArgParser } from "./TextArgParser";


@parser()
export class FloatParser extends TextArgParser {
    name = 'float';
    description = 'A floating-point number. (e.g. 3.14)';

    async parse(arg: TextArgInstaller, context: TextCommandContext) {
        return context.reader.getFloat();
    }
}
