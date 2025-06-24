import { Installer } from "@hades-ts/hades";
import { Container } from "inversify";

import { installCommands } from "./installCommands";
import { defaultMappedTypes, installDefaultMappedTypes, TypePair } from "./installDefaultMappedTypes";

/**
 * Installs slash command support in HadesContainer.
 */
export class SlashCommandsInstaller extends Installer {
    constructor(private readonly mappedTypes: TypePair[] = defaultMappedTypes) {
        super();
    }

    async install(container: Container) {
        installDefaultMappedTypes(container, this.mappedTypes);
        installCommands(container);
    }
}
