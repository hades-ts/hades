import { fluentProvide } from "@ldlework/inversify-binding-decorators";


/**
 * Binds a decorated class as a transient.
 * @param identifier Identifier token to bind to.
 */
export function transient(identifier: any) {
    return fluentProvide(identifier)
        .inTransientScope()
        .done();
};
