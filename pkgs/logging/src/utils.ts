import type { LoggerDecoratorParams } from "./logger";

export const alphabet = "abcdefghijklmnopqrstuvwxyz";

export const randomString = () => {
    let result = "";
    for (let i = 0; i < 10; i++) {
        result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
};

export const isEnabled = (
    disabledTags: string[],
    meta: LoggerDecoratorParams,
) => {
    if (disabledTags.includes(meta.name)) {
        return false;
    }
    for (const tag of meta.tags) {
        if (disabledTags.includes(tag)) {
            return false;
        }
    }
    return true;
};
