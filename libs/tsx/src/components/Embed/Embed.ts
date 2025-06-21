import {
  EmbedAuthorOptions,
  ColorResolvable,
  EmbedImageData,
  EmbedFooterOptions,
  APIEmbedField,
} from "discord.js";
import { Component } from "../../typings/types.js";

export type EmbedResolvable =
  | EmbedAuthorComponent
  | EmbedFooterComponent
  | EmbedFieldsComponent
  | EmbedThumbnailComponent
  | EmbedImageComponent;

export interface EmbedProps {
  color?: ColorResolvable;
  timestamp?: Date | number;
  description?: string;
  title?: string;
  url?: string;
}

export type EmbedComponent = Component<EmbedProps, EmbedResolvable[]> & {
  type: "Embed";
};
export function Embed(
  props: EmbedProps,
  children: EmbedResolvable[]
): EmbedComponent {
  return {
    type: "Embed" as const,
    props,
    children,
  };
}

export type EmbedAuthorComponent = Component<EmbedAuthorOptions, undefined> & {
  type: "EmbedAuthor";
};
export function EmbedAuthor(
  props: EmbedAuthorOptions,
  _children: any
): EmbedAuthorComponent {
  return {
    type: "EmbedAuthor",
    props,
    children: undefined,
  };
}

export type EmbedFooterComponent = Component<EmbedFooterOptions, undefined> & {
  type: "EmbedFooter";
};
export function EmbedBuilderFooter(
  props: EmbedFooterOptions,
  _children: undefined
): EmbedFooterComponent {
  return {
    type: "EmbedFooter",
    props,
    children: undefined,
  };
}

export type EmbedFieldsComponent = Component<
  {},
  EmbedFieldComponent[] | EmbedFieldComponent[][]
> & { type: "EmbedFields" };
export function EmbedFields(
  _props: any,
  children: EmbedFieldComponent[] | EmbedFieldComponent[][]
): EmbedFieldsComponent {
  return {
    type: "EmbedFields",
    props: {},
    children,
  };
}

export type EmbedFieldComponent = Component<APIEmbedField, undefined> & {
  type: "EmbedField";
};
export function EmbedField(
  props: APIEmbedField,
  _children: undefined
): EmbedFieldComponent {
  return {
    type: "EmbedField",
    props,
    children: undefined,
  };
}

export type EmbedThumbnailComponent = Component<EmbedImageData, undefined> & {
  type: "EmbedThumbnail";
};
export function EmbedBuilderThumbnail(
  props: EmbedImageData,
  _children: undefined
): EmbedThumbnailComponent {
  return {
    type: "EmbedThumbnail",
    props,
    children: undefined,
  };
}

export type EmbedImageComponent = Component<EmbedImageData, undefined> & {
  type: "EmbedImage";
};
export function EmbedBuilderImage(
  props: EmbedImageData,
  _children: undefined
): EmbedImageComponent {
  return {
    type: "EmbedImage",
    props,
    children: undefined,
  };
}
