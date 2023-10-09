import { BaseAiThreadingError } from "./threading";

export class AiQuotaError extends BaseAiThreadingError {
    constructor(message: string) {
        super(message);
        this.name = "OpenAIError";
    }
}

export class AiGlobalQuotaError extends AiQuotaError {
    constructor(message: string) {
        super(message);
        this.name = "GlobalQuotaError";
    }
}

export class AiUserQuotaError extends AiQuotaError {
    constructor(message: string) {
        super(message);
        this.name = "UserQuotaError";
    }
}
