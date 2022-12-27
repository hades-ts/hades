import { BaseAiThreadingError } from "./threading"


export class AiAuthzError extends BaseAiThreadingError {
    constructor(message: string) {
        super(message)
        this.name = "AuthzError"
    }
}

export class AiAuthzGuildError extends AiAuthzError {
    constructor(message: string) {
        super(message)
        this.name = "AuthzGuildError"
    }
}

export class AiNoAuthzError extends AiAuthzError {
    constructor(message: string) {
        super(message)
        this.name = "NoAuthzError"
    }
}