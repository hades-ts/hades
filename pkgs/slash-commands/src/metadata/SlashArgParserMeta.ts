import type { Newable } from "@hades-ts/core";

import type { SlashArgParser } from "../services";

export class SlashArgParserMeta {
    type!: Newable<SlashArgParser>;
    description!: string;
}
