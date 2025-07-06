import { createCategoricContainer } from "@ldlework/categoric-containers";
import { type Container, injectFromBase } from "inversify";

const { install, singleton, transient, request } = createCategoricContainer();

const withDecorators = () => (c: Container) => {
    install(c);
};

const based = injectFromBase({
    extendConstructorArguments: false,
    extendProperties: true,
});

export * from "./listener";
export * from "./listenFor";
export * from "./service";

export { based, request, singleton, transient, withDecorators };
