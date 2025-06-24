import { InstallerFunc, Newable } from "@hades-ts/hades";
import { Collection } from "discord.js";

import { SlashArgParser } from "../services";
import { SlashArgParserMeta } from "./SlashArgParserMeta";
import { SlashCommandMeta } from "./SlashCommandMeta";

// key where @parser metadata is stored
const PARSER_METADATA = Symbol("Hades:ParserMetadata");
// key where @command metadata is stored
const COMMAND_METADATA = Symbol("Hades:CommandMetadata");

/**
 * Get all metas defined with @command
 * @returns A collection of SlashCommandMetas
 */
export function getSlashCommandMetas(): Collection<Newable, SlashCommandMeta> {
    let metas = Reflect.getMetadata(COMMAND_METADATA, SlashCommandMeta);
    if (metas === undefined) {
        metas = new Collection<Newable, SlashCommandMeta>();
        setSlashCommandMetas(metas);
    }
    return metas;
}

/**
 * Updates the set of @command metas.
 * @param metas All SlashCommandMeta objects.
 * @returns
 */
export function setSlashCommandMetas(metas: Collection<Newable, SlashCommandMeta>) {
    return Reflect.defineMetadata(COMMAND_METADATA, metas, SlashCommandMeta);
}

/**
 * Get the command metadata for a particular class.
 * @param target Target class object.
 * @returns
 */
export function getSlashCommandMeta(target: Newable) {
    const metas = getSlashCommandMetas();
    let meta = metas.get(target);
    if (meta === undefined) {
        meta = new SlashCommandMeta();
        meta.target = target;
        metas.set(target, meta);
    }
    return meta;
}

/**
 * Get the metadata for a particular argument.
 * @param target Target class object.
 * @param argName Target argument field name.
 * @returns
 */
export function getSlashArgMeta(target: Newable, argName: string) {
    const meta = getSlashCommandMeta(target);
    return meta.getArgMeta(argName);
}

/**
 * Get all @parser metas.
 * @returns A Collection of all Parser metas.
 */
export function getSlashParserMetas(): Set<SlashArgParserMeta> {
    let metas = Reflect.getMetadata(PARSER_METADATA, SlashArgParserMeta);
    if (metas === undefined) {
        metas = new Set<SlashArgParserMeta>();
        setSlashParserMetas(metas);
    }
    return metas;
}

/**
 * Update the set of @parser metas.
 * @param metas Collection of @parser metas.
 * @returns
 */
export function setSlashParserMetas(metas: Collection<string, SlashArgParserMeta>) {
    return Reflect.defineMetadata(PARSER_METADATA, metas, SlashArgParserMeta);
}

/**
 * Register a class as a parser.
 * @param target Target parser class.
 */
export function registerSlashParser(target: Newable<SlashArgParser>) {
    const metas = getSlashParserMetas();
    const meta = new SlashArgParserMeta();
    meta.type = target;
    metas.add(meta);
}

/**
 * Add a method as a validator for an argument.
 * @param target Target class object.
 * @param argName Target argument field name.
 * @param methodName Validator method name.
 * @returns
 */
export function addSlashValidatorMethod(target: Newable, argName: string, methodName: string) {
    const meta = getSlashArgMeta(target, argName);
    return meta.validatorMethods.add(methodName);
}

/**
 * Add an installer for a Validator for the given argument.
 * @param target Target class object.
 * @param argName Target argument field name.
 * @param installer Validator installer.
 */
export function addSlashArgValidator(target: Newable, argName: string, installer: InstallerFunc) {
    const meta = getSlashArgMeta(target, argName);
    meta.validatorInstallers.push(installer);
}
