import { Container } from "inversify"


export type Constructor<T = any> = new (...args: any[]) => T
export type Newable<T = any> = Constructor<T> | Function;
export type Constructable<T = any> = { constructor: Newable<T> };
export type InstallerFunc = (container: Container) => void;