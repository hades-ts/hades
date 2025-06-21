import type {
  EmbedAuthorOptions,
  EmbedFooterOptions,
  EmbedField,
  EmbedImageData,
  SelectMenuComponentOptionData,
} from "discord.js";
import {
  EmbedProps,
  ActionRowComponent,
  EmbedComponent,
  ButtonOptions,
  StringSelectMenuOptions,
} from "../index.js";

// This sucks
export type ComponentPropTypes =
  | (ButtonOptions & { customId?: string; url?: string })
  | StringSelectMenuOptions
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
  | "StringSelectMenu"
  | "SelectMenuOption"
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

export type FragmentResolvable = ActionRowComponent | EmbedComponent;
