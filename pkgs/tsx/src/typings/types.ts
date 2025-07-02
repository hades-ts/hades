import type {
    EmbedAuthorOptions,
    EmbedBuilder,
    EmbedField,
    EmbedFooterOptions,
    EmbedImageData,
    SelectMenuComponentOptionData,
} from "discord.js";

import type {
    ActionRowComponent,
    ButtonOptions,
    ChannelSelectMenuOptions,
    EmbedComponent,
    EmbedProps,
    RoleSelectMenuOptions,
    StringSelectMenuOptions,
    UserSelectMenuOptions,
} from "../index.js";

// This sucks
export type ComponentPropTypes =
    | (ButtonOptions & { customId?: string; url?: string })
    | StringSelectMenuOptions
    | UserSelectMenuOptions
    | RoleSelectMenuOptions
    | ChannelSelectMenuOptions
    | SelectMenuComponentOptionData
    | EmbedProps
    | EmbedAuthorOptions
    | EmbedFooterOptions
    | EmbedField
    | EmbedImageData
    | {}
    | undefined
    | null;

export type ElementType =
    | "Root"
    | "ActionRow"
    | "Button"
    | "LinkButton"
    | "StringSelectMenu"
    | "SelectMenuOption"
    | "UserSelectMenu"
    | "RoleSelectMenu"
    | "ChannelSelectMenu"
    | "Embed"
    | "EmbedAuthor"
    | "EmbedFooter"
    | "EmbedFields"
    | "EmbedField"
    | "EmbedThumbnail"
    | "EmbedImage";

export type Atom =
    | Component
    | object
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined;

export type ComponentFactory<P = ComponentPropTypes, C = Atom[]> = (
    props?: P,
    children?: C,
) => Component<P, C>;

export interface Component<P = ComponentPropTypes, C = Atom[]> {
    type: ElementType;
    props: P;
    children?: C;
}

export interface BuilderComponent<B, P = ComponentPropTypes, C = Atom[]> {
    type: ElementType;
    props: P;
    children?: C;
    resolve: (props: P, children?: C) => B;
}

export interface EmbedPropertyComponent<P = ComponentPropTypes, C = Atom[]> {
    type: ElementType;
    props: P;
    children?: C;
    resolve: (builder: EmbedBuilder, props: P, children?: C) => void;
}

export type FragmentResolvable = ActionRowComponent | EmbedComponent;
