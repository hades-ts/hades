import { fluentProvide } from "@ldlework/inversify-binding-decorators";


/**
 * Binds a decorated class as a request.
 * @param identifier Identifier token to bind to.
 */
export function request(identifier: any) {
    return fluentProvide(identifier)
        .inRequestScope()
        .done();
};
