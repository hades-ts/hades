import { TextArgInstaller, TextCommandContext } from "../../commands";
import { parser } from "../decorators";
import { TextArgParser } from "./TextArgParser";

@parser()
export class ChannelParser extends TextArgParser {
    name = "channel";
    description = "A Discord channel.";

    async parse(arg: TextArgInstaller, context: TextCommandContext) {
        const id = context.reader.getChannelID();
        if (id) {
            return context.msg.client.channels.cache.get(id);
        }
    }
}
