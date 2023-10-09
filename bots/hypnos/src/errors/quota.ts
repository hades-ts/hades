import { BaseThreadingError } from "./threading";

export class QuotaError extends BaseThreadingError {
    constructor(message: string) {
        super(message);
        this.name = "OpenAIError";
    }
}

export class GlobalQuotaError extends QuotaError {
    constructor(message: string) {
        super(message);
        this.name = "GlobalQuotaError";
    }
}

export class UserQuotaError extends QuotaError {
    constructor(message: string) {
        super(message);
        this.name = "UserQuotaError";
    }
}
