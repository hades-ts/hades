import { Container, injectable } from "inversify";

@injectable()
export abstract class GuildBinder {
    abstract bind(guildContainer: Container): Promise<void>;
}
