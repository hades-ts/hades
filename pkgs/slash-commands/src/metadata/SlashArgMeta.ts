import type { Constructor, InstallerFunc } from "@hades-ts/hades";
import type { ApplicationCommandOptionData } from "discord.js";
import type { interfaces } from "inversify";
import type { SlashArgParser } from "../services";

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
