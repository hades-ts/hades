import {
  SelectMenuComponentOptionData,
  StringSelectMenuComponentData,
} from "discord.js";
import { Component } from "../../typings/types.js";

export type StringSelectMenuOptions = Partial<StringSelectMenuComponentData>;

export type StringSelectMenuComponent = Component<
  StringSelectMenuOptions,
  SelectMenuOptionComponent[] | SelectMenuOptionComponent[][]
> & { type: "StringSelectMenu" };
export function StringSelectMenu(
  props: StringSelectMenuOptions,
  children: SelectMenuOptionComponent[] | SelectMenuOptionComponent[][]
): StringSelectMenuComponent {
  return {
    type: "StringSelectMenu",
    props,
    children,
  };
}

export type SelectMenuOptionComponent = Component<
  SelectMenuComponentOptionData,
  undefined
> & { type: "SelectMenuOption" };
export function SelectMenuOption(
  props: SelectMenuComponentOptionData,
  _children: undefined
): SelectMenuOptionComponent {
  return {
    type: "SelectMenuOption",
    props,
    children: undefined,
  };
}
