import { interfaces } from "inversify";
import { Validator } from "./Validator";

export * from "./Validator";
export type Validators<T> = Array<interfaces.Newable<Validator<T>>>;