import { TextArgInstaller, TextCommandContext } from "../../commands";
import { parser } from "../decorators";
import { TextArgParser } from "./TextArgParser";

@parser()
export class RoleIdParser extends TextArgParser {
    name = "role id";
    description = "A Discord Role ID.";

    async parse(arg: TextArgInstaller, context: TextCommandContext) {
        return context.reader.getRoleID();
    }
}
