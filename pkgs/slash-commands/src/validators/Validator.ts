import { type Container, injectable } from "inversify";

import { addSlashArgValidator } from "../metadata";
import { whenTargetNamedConstraint } from "../utils/whenTargetNamed";

/**
 * Base class for reusable argument validators.
 */
@injectable()
export class Validator<T = any> {
    public async validate(_value: T) {
        return;
    }

    static check<ValueType>() {
        return <ClassType extends { [key: string]: ValueType }>(
            // biome-ignore lint/suspicious/noShadowRestrictedNames: ¯\_(ツ)_/¯
            { constructor }: ClassType,
            key: string & keyof ClassType,
        ) => {
            // Verify the target field has the expected type at runtime
            addSlashArgValidator(constructor, key, (container: Container) => {
                container
                    .bind(Validator)
                    .to(Validator)
                    .when(whenTargetNamedConstraint(key));
            });
        };
    }
}
