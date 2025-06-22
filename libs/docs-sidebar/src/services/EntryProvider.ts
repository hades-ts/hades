import { inject, injectable, postConstruct } from "inversify";
import { readdirSync } from "fs";

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
