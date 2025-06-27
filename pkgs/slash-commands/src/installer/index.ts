import type { Container } from "inversify";

import { installCommands } from "./installCommands";
import {
    installDefaultMappedTypes,
    type TypePair,
} from "./installDefaultMappedTypes";

export const withSlashCommands =
    (options?: { mappedTypes?: TypePair[] }) => (container: Container) => {
        installDefaultMappedTypes(container, options?.mappedTypes ?? []);
        installCommands(container);
    };
