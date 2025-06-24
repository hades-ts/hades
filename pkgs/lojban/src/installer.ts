import { Container } from "inversify";

import dict from "./dictionaries/parsed-en";

export const installLojbanSupport = (container: Container) => {
    container.bind("LOJBAN_DICT").toConstantValue(dict);
};
