import { createClassCategoric } from "@ldlework/categoric-decorators";
import type { Container, Newable, ServiceIdentifier } from "inversify";

import { singleton } from ".";

export const [_service, findServices] = createClassCategoric();

export function service() {
    return <T extends Newable>(target: T) => {
        _service()(target);
        singleton()(target);
    };
}

export const withServices = (container: Container) => {
    for (const [type] of findServices()) {
        container.get(type as ServiceIdentifier<any>);
    }
};
