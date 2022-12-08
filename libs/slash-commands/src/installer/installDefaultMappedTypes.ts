import { Container } from "inversify";
import { Constructable, Newable } from "@hades-ts/hades";
import { ChannelParser, MemberParser, SlashArgParser, StringParser } from "../parsers";
import { GuildChannel, GuildMember, Role, User } from "discord.js";
import { UserParser } from "../parsers/User";
import { RoleParser } from "../parsers/Role";

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
            container.bind('MappedTypes').toConstantValue(pair)
        }
    );
}