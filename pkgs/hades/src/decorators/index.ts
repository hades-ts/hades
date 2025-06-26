import {
    createCategoricContainer,
    type ServiceIdentifier,
} from "@ldlework/categoric-containers";
import { injectFromBase } from "inversify";

const {
    install,
    singleton: _singleton,
    transient: _transient,
    request: _request,
} = createCategoricContainer();

const singleton = (
    serviceIdentifier?: ServiceIdentifier,
    _injectFromBase = true,
) => {
    return (target: any) => {
        _singleton(serviceIdentifier)(target);
        if (_injectFromBase) {
            injectFromBase({
                extendConstructorArguments: false,
                extendProperties: true,
            })(target);
        }
    };
};

const transient = (
    serviceIdentifier: ServiceIdentifier,
    _injectFromBase = true,
) => {
    return (target: any) => {
        _transient(serviceIdentifier)(target);
        if (_injectFromBase) {
            injectFromBase({
                extendConstructorArguments: false,
                extendProperties: true,
            })(target);
        }
    };
};

const request = (
    serviceIdentifier: ServiceIdentifier,
    _injectFromBase = true,
) => {
    return (target: any) => {
        _request(serviceIdentifier)(target);
        if (_injectFromBase) {
            injectFromBase({
                extendConstructorArguments: false,
                extendProperties: true,
            })(target);
        }
    };
};

export * from "./listenFor";

export { install, singleton, transient, request };
