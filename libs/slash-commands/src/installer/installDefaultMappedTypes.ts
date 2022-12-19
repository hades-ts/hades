import { Container } from "inversify";
import { Constructable, Newable } from "@hades-ts/hades";
import { GuildChannel, GuildMember, Role, User } from "discord.js";
import { RoleParser, UserParser, ChannelParser, MemberParser } from "../builtins";
import { SlashArgParser, StringParser } from "../services";



export type TypePair = readonly [Constructable, Newable<SlashArgParser>];

export const defaultMappedTypes: TypePair[] = [
    [String, StringParser],
    [GuildMember, MemberParser],
    [User, UserParser],
    [GuildChannel, ChannelParser],
    [Role, RoleParser]
]

/**
 * Binds which Parsers to use for what argument types, by default.
 * @param container HadesContainer to use.
 * @param mappedTypes Type mappings.
 */
export const installDefaultMappedTypes = (container: Container, mappedTypes: TypePair[]) => {
    mappedTypes.forEach(
        pair => {
            container.bind('SlashMappedTypes').toConstantValue(pair)
        }
    );
}