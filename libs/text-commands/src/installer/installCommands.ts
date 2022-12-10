import { Container } from "inversify";
import { TextCommandFactory } from "../services/TextCommandFactory/TextCommandFactory";
import { getTextCommandMetas, TextCommandMeta } from "../metadata";
import { TextCommandHelper } from "../services/TextCommandHelpService/TextCommandHelper";


type Metas = ReturnType<typeof getTextCommandMetas>

const installCommandFactory = (container: Container, meta: TextCommandMeta) => {
    const factory = new TextCommandFactory(container, meta);
    container
        .bind<TextCommandFactory>(TextCommandFactory)
        .toConstantValue(factory);
}

const installCommandFactories = (container: Container, metas: Metas) => {
    metas.forEach(meta => installCommandFactory(container, meta))
}

const installCommandHelper = (container: Container, meta: TextCommandMeta) => {
    const helper = new TextCommandHelper(meta);
    container
        .bind(TextCommandHelper)
        .toConstantValue(helper)
}

const installCommandHelpers = (container: Container, metas: Metas) => {
    metas.forEach(meta => installCommandHelper(container, meta))
}

/**
 * Used by the TextCommandsInstaller construct a 
 * TextCommandFactory for each @command class into 
 * the HadesContainer. These are then used by the 
 * TextCommandService to create instances of commands.
 * 
 * @param container The HadesContainer to use.
 */
export const installCommands = (container: Container) => {
    const metas = getTextCommandMetas()
    installCommandFactories(container, metas)
    installCommandHelpers(container, metas)
}