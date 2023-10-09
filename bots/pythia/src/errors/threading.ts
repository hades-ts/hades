export class BaseThreadingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BaseThreadingError";
    }
}
