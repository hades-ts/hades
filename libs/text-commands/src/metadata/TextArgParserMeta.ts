import { TextArgParser as TextParser } from "../parsers";
import { Newable } from "@hades-ts/hades";


export class TextArgParserMeta {
    type: Newable<TextParser>;
    description?: string;
}
