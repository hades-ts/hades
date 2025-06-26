import type { Newable } from "inversify";
import type { Validator } from "./Validator";

export * from "./Validator";
export type Validators<T> = Array<Newable<Validator<T>>>;
