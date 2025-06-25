import {
    arg,
    command,
    description,
    TextCommand,
} from "@hades-ts/text-commands";
import { inject, postConstruct } from "inversify";

@command("lj")
@description("Translate english word into Lojban.")
export class ToLojban extends TextCommand {
    @arg()
    @description("Word to lookup.")
    protected word!: string;

    @inject("LOJBAN_DICT")
    protected dict: any;

    @postConstruct()
    public init() {
        this.word = this.word.toLowerCase();
    }

    protected cleanDefinition(meaning: string) {
        return meaning
            .replace("$x_{1}$", "`x1`")
            .replace("$x_{2}$", "`x2`")
            .replace("$x_{3}$", "`x3`")
            .replace("$x_{4}$", "`x4`")
            .replace("$x_{5}$", "`x5`");
    }

    async execute() {}
}
