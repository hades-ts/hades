import { TextArgInstaller, TextCommandContext } from "../../commands";
import { parser } from "../decorators";
import { TextArgParser } from "./TextArgParser";

@parser()
export class UserIdParser extends TextArgParser {
    name = "user id";
    description = "Discord User ID. (Right-click, Copy ID)";

    async parse(arg: TextArgInstaller, context: TextCommandContext) {
        return context.reader.getUserID();
    }
}
