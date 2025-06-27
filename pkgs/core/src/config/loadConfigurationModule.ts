import {
    EagerBinder,
    type EagerBinderSettings,
} from "@ldlework/inversify-config-injection";
import { type Container, ContainerModule } from "inversify";

export type ConfigOptions = EagerBinderSettings;

export function withConfig(settings?: ConfigOptions) {
    return (container: Container) => {
        const configBinder = new EagerBinder({
            prefix: "cfg",
            objects: true,
            ...(settings || {}),
        });
        const configCallback = configBinder.getModuleFunction();
        const configModule = new ContainerModule(configCallback);
        container.load(configModule);
    };
}
