import { TextArgInstaller, TextCommandContext } from "../../commands";
import { parser } from "../decorators";
import { TextArgParser } from "./TextArgParser";


@parser()
export class StringParser extends TextArgParser {
    name = 'string';
    description = 'Anything really. Use "quote for spaces"."';

    async parse(arg: TextArgInstaller, context: TextCommandContext) {
        return context.reader.getString();
    }
}
