import { readdirSync } from "node:fs";

import { inject, injectable, postConstruct } from "inversify";

@injectable()
export class SectionEntryProvider {
    @inject("SubSectionRoot")
    subSectionRoot!: string;

    public entries!: string[];

    @postConstruct()
    init() {
        this.entries = readdirSync(this.subSectionRoot);
    }
}
