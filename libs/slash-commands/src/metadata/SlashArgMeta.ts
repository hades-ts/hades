import { Constructor, InstallerFunc, Newable } from "@hades-ts/hades";
import { ApplicationCommandOptionData } from "discord.js";
import { SlashArgParser } from "../parsers/SlashArgParser";

/**
 * Decorator metdata for command arguments.
 */
export class SlashArgMeta {
    name?: string;
    type?: Constructor;
    property?: string;
    description?: string;
    options?: ApplicationCommandOptionData;
    parserType?: Newable<SlashArgParser>;
    validatorMethods = new Set<string>();
    validatorInstallers: InstallerFunc[] = [];
}