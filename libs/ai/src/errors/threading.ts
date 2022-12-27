export class BaseAiThreadingError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "BaseThreadingError"
    }
}