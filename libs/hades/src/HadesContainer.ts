import { Container, ContainerModule, interfaces } from "inversify";
import { buildProviderModule } from '@ldlework/inversify-binding-decorators';
import { EagerBinder, EagerBinderSettings } from "@ldlework/inversify-config-injection";
import { Installer } from "./Installer";
import { InstallerFunc } from "./utils";


export type ConfigOptions = EagerBinderSettings

export type HadesContainerOptions = interfaces.ContainerOptions & {
    installers?: (Installer | InstallerFunc)[];
    configOptions?: ConfigOptions
}


/**
 * An Inversify container for building bots with Hades.
 */
export class HadesContainer extends Container {
    constructor(options?: HadesContainerOptions) {
        const { installers, ...containerOptions } = options || {};
        super({ ...containerOptions, skipBaseClassChecks: true });
        this.bind(HadesContainer).toConstantValue(this);
        this.load(buildProviderModule()); // binding-decorators support
        this.loadConfigurationModule(options.configOptions);
        for (const installer of installers || []) {
            if (installer instanceof Installer) {
                installer.install(this);
            } else {
                installer(this);
            }
        }
    }

    /**
     * Enables inverisfy-config-injection support.
     */
    private loadConfigurationModule(settings?: ConfigOptions) {
        const configBinder = new EagerBinder({ 
            prefix: 'cfg', 
            objects: true,
            ...settings || {},
        });
        const configCallback = configBinder.getModuleFunction();
        const configModule = new ContainerModule(configCallback);
        this.load(configModule);
    }
}

