import { inject, injectable } from "inversify";
import { HadesClient } from "./HadesClient";
import type { ILoginService } from "./ILogin";

@injectable()
export class LoginService implements ILoginService {
    @inject(HadesClient)
    client!: HadesClient;

    @inject("cfg.discordToken")
    token!: string;

    async login(): Promise<string> {
        return this.client.login(this.token.toString());
    }
}
