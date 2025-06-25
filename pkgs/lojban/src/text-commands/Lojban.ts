import {
    arg,
    command,
    description,
    TextArgError,
    TextCommand,
    validate,
} from "@hades-ts/text-commands";
import { inject, postConstruct } from "inversify";

@command("lojban")
@description("Get definition of a lojban word.")
export class Lojban extends TextCommand {
    @arg()
    @description("Word to lookup.")
    protected word!: string;

    @inject("LOJBAN_DICT")
    protected dict: any;

    get data() {
        return this.dict[this.word];
    }

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

    async execute(): Promise<any> {
        const definition = this.cleanDefinition(this.data["d"]);
        return this.reply(`\`${this.word}\`:  ${definition}`);
    }

    @validate("word")
    public async validate() {
        if (!this.data) {
            throw new TextArgError(
                `I don't know ${this.word} to be a Lojban word.`,
            );
        }
    }
}
