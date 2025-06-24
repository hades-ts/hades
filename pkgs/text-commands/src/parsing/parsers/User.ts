import { TextArgInstaller, TextCommandContext } from "../../commands";
import { parser } from "../decorators";
import { TextArgParser } from "./TextArgParser";

@parser()
export class UserParser extends TextArgParser {
    name = "user";
    description = "A Discord User.";

    async parse(arg: TextArgInstaller, context: TextCommandContext) {
        const id = context.reader.getUserID();
        if (id) {
            return context.msg.client.users.cache.get(id);
        }
    }
}
