import { TextArgInstaller, TextCommandContext } from "../../commands";
import { parser } from "../decorators";
import { TextArgParser } from "./TextArgParser";


@parser()
export class ChannelIdParser extends TextArgParser {
    name = 'channel id';
    description = 'Discord Channel ID (Right-click, Copy ID)';

    async parse(arg: TextArgInstaller, context: TextCommandContext) {
        return context.reader.getChannelID();
    }
}
