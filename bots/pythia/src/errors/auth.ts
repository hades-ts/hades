import { BaseThreadingError } from "./threading";


export class AuthzError extends BaseThreadingError {
    constructor(message: string) {
        super(message);
        this.name = "AuthzError";
    }
}

export class AuthzGuildError extends AuthzError {
    constructor(message: string) {
        super(message);
        this.name = "AuthzGuildError";
    }
}

export class NoAuthzError extends AuthzError {
    constructor(message: string) {
        super(message);
        this.name = "NoAuthzError";
    }
}