import { Constructor, InstallerFunc, Newable } from "@hades-ts/hades";
import { ApplicationCommandOptionData } from "discord.js";

import { SlashArgParser } from "../services";
import { interfaces } from "inversify";

/**
 * Decorator metdata for command arguments.
 */
export class SlashArgMeta {
    name!: string;
    type!: Constructor;
    property!: string;
    parser!: SlashArgParser;
    description!: string;
    options!: ApplicationCommandOptionData;
    choicesResolver?: interfaces.Newable<any>;
    choicesCompleter?: interfaces.Newable<any>;
    validatorMethods = new Set<string>();
    validatorInstallers: InstallerFunc[] = [];
}
