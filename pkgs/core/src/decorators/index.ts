import {
    createCategoricContainer,
    type ServiceIdentifier,
} from "@ldlework/categoric-containers";
import { injectFromBase } from "inversify";

const {
    install: withDecorators,
    singleton,
    transient,
    request,
} = createCategoricContainer();

const based = injectFromBase({
    extendConstructorArguments: false,
    extendProperties: true,
});

export * from "./listener";
export * from "./listenFor";
export * from "./service";

export { withDecorators, singleton, transient, request, based };
