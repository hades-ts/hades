import * as discord_js from 'discord.js';
import { SelectMenuComponentOptionData, EmbedAuthorOptions, EmbedFooterOptions, EmbedField as EmbedField$1, EmbedImageData, EmbedBuilder, ActionRowBuilder, ColorResolvable, APIEmbedField, InteractionButtonComponentData, ButtonBuilder, LinkButtonComponentData, StringSelectMenuComponentData, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SelectMenuOptionBuilder, UserSelectMenuComponentData, UserSelectMenuBuilder, RoleSelectMenuComponentData, RoleSelectMenuBuilder, ChannelSelectMenuComponentData, ChannelSelectMenuBuilder } from 'discord.js';

type ComponentPropTypes = (ButtonOptions & {
    customId?: string;
    url?: string;
}) | StringSelectMenuOptions | UserSelectMenuOptions | RoleSelectMenuOptions | ChannelSelectMenuOptions | SelectMenuComponentOptionData | EmbedProps | EmbedAuthorOptions | EmbedFooterOptions | EmbedField$1 | EmbedImageData | {} | undefined | null;
type ElementType = "Root" | "ActionRow" | "Button" | "LinkButton" | "StringSelectMenu" | "SelectMenuOption" | "UserSelectMenu" | "RoleSelectMenu" | "ChannelSelectMenu" | "Embed" | "EmbedAuthor" | "EmbedFooter" | "EmbedFields" | "EmbedField" | "EmbedThumbnail" | "EmbedImage";
type Atom = Component | object | string | number | bigint | boolean | null | undefined;
interface ComponentFactory<P = ComponentPropTypes, C = Atom[]> {
    (props?: P, children?: C): Component<P, C>;
}
interface Component<P = ComponentPropTypes, C = Atom[]> {
    type: ElementType;
    props: P;
    children?: C;
}
interface BuilderComponent<B, P = ComponentPropTypes, C = Atom[]> {
    type: ElementType;
    props: P;
    children?: C;
    resolve: (props: P, children?: C) => B;
}
interface EmbedPropertyComponent<P = ComponentPropTypes, C = Atom[]> {
    type: ElementType;
    props: P;
    children?: C;
    resolve: (builder: EmbedBuilder, props: P, children?: C) => void;
}
type FragmentResolvable = ActionRowComponent | EmbedComponent;

declare class DiscordComponents {
    static createComponent<P = ComponentPropTypes>(component: ComponentFactory<P>, props: P, ...children: Atom[]): Component<P>;
    static Fragment(props: null, children: FragmentResolvable[]): {
        embeds: EmbedBuilder[];
        components: ActionRowBuilder[];
    };
}

type EmbedResolvable = EmbedAuthorComponent | EmbedFooterComponent | EmbedFieldsComponent | EmbedThumbnailComponent | EmbedImageComponent;
interface EmbedProps {
    color?: ColorResolvable;
    timestamp?: Date | number;
    description?: string;
    title?: string;
    url?: string;
}
type EmbedComponent = BuilderComponent<EmbedBuilder, EmbedProps, EmbedResolvable[]> & {
    type: "Embed";
};
declare const EmbedResolver: (props: EmbedProps, children: EmbedResolvable[]) => EmbedBuilder;
declare function Embed(props: EmbedProps, children: EmbedResolvable[]): EmbedComponent;
type EmbedAuthorComponent = EmbedPropertyComponent<EmbedAuthorOptions> & {
    type: "EmbedAuthor";
};
declare function EmbedAuthor(props: EmbedAuthorOptions, _children: undefined): EmbedAuthorComponent;
type EmbedFooterComponent = EmbedPropertyComponent<EmbedFooterOptions> & {
    type: "EmbedFooter";
};
declare function EmbedBuilderFooter(props: EmbedFooterOptions, _children: undefined): EmbedFooterComponent;
type EmbedFieldsComponent = EmbedPropertyComponent<{}, EmbedPropertyComponent[]> & {
    type: "EmbedFields";
};
declare function EmbedFields(_props: any, children: EmbedFieldComponent[] | EmbedFieldComponent[][]): EmbedFieldsComponent;
type EmbedFieldComponent = EmbedPropertyComponent<APIEmbedField> & {
    type: "EmbedField";
};
declare function EmbedField(props: APIEmbedField, _children: undefined): EmbedFieldComponent;
type EmbedThumbnailComponent = EmbedPropertyComponent<EmbedImageData> & {
    type: "EmbedThumbnail";
};
declare function EmbedBuilderThumbnail(props: EmbedImageData, _children: undefined): EmbedThumbnailComponent;
type EmbedImageComponent = EmbedPropertyComponent<EmbedImageData> & {
    type: "EmbedImage";
};
declare function EmbedBuilderImage(props: EmbedImageData, _children: undefined): EmbedImageComponent;

type ButtonOptions = Omit<InteractionButtonComponentData, "type">;
type ButtonComponent = BuilderComponent<ButtonBuilder, ButtonOptions, undefined> & {
    type: "Button";
};
declare const ButtonResolver: (props: ButtonOptions) => ButtonBuilder;
declare function Button(props: ButtonOptions): ButtonComponent;
type LinkButtonOptions = Omit<LinkButtonComponentData, "type">;
type LinkButtonComponent = BuilderComponent<ButtonBuilder, LinkButtonOptions, undefined> & {
    type: "LinkButton";
};
declare const LinkButtonResolver: (props: LinkButtonOptions) => ButtonBuilder;
declare function LinkButton(props: LinkButtonOptions): LinkButtonComponent;

type StringSelectMenuOptions = Omit<StringSelectMenuComponentData, "type" | "options">;
type StringSelectMenuComponent = BuilderComponent<StringSelectMenuBuilder, StringSelectMenuOptions, SelectMenuOptionComponent[] | SelectMenuOptionComponent[][]> & {
    type: "StringSelectMenu";
};
declare const StringSelectMenuResolver: (props: StringSelectMenuOptions, children: SelectMenuOptionComponent[] | SelectMenuOptionComponent[][]) => StringSelectMenuBuilder;
declare function StringSelectMenu(props: StringSelectMenuOptions, children: SelectMenuOptionComponent[] | SelectMenuOptionComponent[][]): StringSelectMenuComponent;
type SelectMenuOptionOptions = SelectMenuComponentOptionData;
type SelectMenuOptionComponent = BuilderComponent<StringSelectMenuOptionBuilder, SelectMenuComponentOptionData, undefined> & {
    type: "SelectMenuOption";
};
declare const SelectMenuOptionResolver: (props: SelectMenuComponentOptionData) => SelectMenuOptionBuilder;
declare function SelectMenuOption(props: SelectMenuComponentOptionData): SelectMenuOptionComponent;

type UserSelectMenuOptions = Omit<UserSelectMenuComponentData, "type" | "options">;
type UserSelectMenuComponent = BuilderComponent<UserSelectMenuBuilder, UserSelectMenuOptions, undefined> & {
    type: "UserSelectMenu";
};
declare const UserSelectMenuResolver: (props: UserSelectMenuOptions) => UserSelectMenuBuilder;
declare function UserSelectMenu(props: UserSelectMenuOptions): UserSelectMenuComponent;

type RoleSelectMenuOptions = Omit<RoleSelectMenuComponentData, "type" | "options">;
type RoleSelectMenuComponent = BuilderComponent<RoleSelectMenuBuilder, RoleSelectMenuOptions, undefined> & {
    type: "RoleSelectMenu";
};
declare const RoleSelectMenuResolver: (props: RoleSelectMenuOptions) => RoleSelectMenuBuilder;
declare function RoleSelectMenu(props: RoleSelectMenuOptions): RoleSelectMenuComponent;

type ChannelSelectMenuOptions = Omit<ChannelSelectMenuComponentData, "type" | "options">;
type ChannelSelectMenuComponent = BuilderComponent<ChannelSelectMenuBuilder, ChannelSelectMenuOptions, undefined> & {
    type: "ChannelSelectMenu";
};
declare const ChannelSelectMenuResolver: (props: ChannelSelectMenuOptions) => ChannelSelectMenuBuilder;
declare function ChannelSelectMenu(props: ChannelSelectMenuOptions): ChannelSelectMenuComponent;

type ActionRowResolvable = ButtonComponent | StringSelectMenuComponent | UserSelectMenuComponent | RoleSelectMenuComponent | ChannelSelectMenuComponent;
type ActionRowComponent = BuilderComponent<ActionRowBuilder, {}, ActionRowResolvable[] | ActionRowResolvable[][]> & {
    type: "ActionRow";
};
declare const ActionRowResolver: (props: {}, children: ActionRowResolvable[] | ActionRowResolvable[][]) => ActionRowBuilder<discord_js.AnyComponentBuilder>;
declare function ActionRow(_props: {}, children: ActionRowResolvable[]): ActionRowComponent;

export { ActionRow, type ActionRowComponent, type ActionRowResolvable, ActionRowResolver, type Atom, type BuilderComponent, Button, type ButtonComponent, type ButtonOptions, ButtonResolver, ChannelSelectMenu, type ChannelSelectMenuComponent, type ChannelSelectMenuOptions, ChannelSelectMenuResolver, type Component, type ComponentFactory, type ComponentPropTypes, DiscordComponents, type ElementType, Embed, EmbedAuthor, type EmbedAuthorComponent, EmbedBuilderFooter, EmbedBuilderImage, EmbedBuilderThumbnail, type EmbedComponent, EmbedField, type EmbedFieldComponent, EmbedFields, type EmbedFieldsComponent, type EmbedFooterComponent, type EmbedImageComponent, type EmbedPropertyComponent, type EmbedProps, type EmbedResolvable, EmbedResolver, type EmbedThumbnailComponent, type FragmentResolvable, LinkButton, type LinkButtonComponent, type LinkButtonOptions, LinkButtonResolver, RoleSelectMenu, type RoleSelectMenuComponent, type RoleSelectMenuOptions, RoleSelectMenuResolver, SelectMenuOption, type SelectMenuOptionComponent, type SelectMenuOptionOptions, SelectMenuOptionResolver, StringSelectMenu, type StringSelectMenuComponent, type StringSelectMenuOptions, StringSelectMenuResolver, UserSelectMenu, type UserSelectMenuComponent, type UserSelectMenuOptions, UserSelectMenuResolver };
