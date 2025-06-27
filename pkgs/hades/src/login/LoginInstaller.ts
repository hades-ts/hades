import type { Container } from "inversify";
import { ILoginService } from "./ILogin";
import { LoginService } from "./LoginService";

export const withLogin = (container: Container) => {
    if (!container.isBound(ILoginService)) {
        container.bind(ILoginService).to(LoginService);
    }
};
