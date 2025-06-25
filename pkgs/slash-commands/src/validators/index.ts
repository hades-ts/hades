import type { interfaces } from "inversify";
import type { Validator } from "./Validator";

export * from "./Validator";
export type Validators<T> = Array<interfaces.Newable<Validator<T>>>;
