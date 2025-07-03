import { inject, injectable } from "inversify";

import { ILogger, logger } from "@hades-ts/logging";
import { HadesClient } from "../services/HadesClient";
import type { ILoginService } from "./ILogin";

@injectable()
export class LoginService implements ILoginService {
    @inject(HadesClient)
    client!: HadesClient;

    @inject("cfg.discordToken")
    token!: string;

    @logger("LoginService")
    log!: ILogger;

    async login() {
        this.log.info("Logging into Discord.");
        const result = await this.client.login(this.token.toString());
        this.log.info("Logged into Discord.");
        return result;
    }
}
