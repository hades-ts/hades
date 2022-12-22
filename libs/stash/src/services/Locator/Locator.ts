import { injectable } from "inversify";


@injectable()
export abstract class Locator {
    /**
     * This class returns a list of all potential stash files at the
     * configured stashPath.
     */
    abstract findAllSync(): string[];
}