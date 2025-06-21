import { Component } from "../../typings/types.js";
import { ButtonComponent } from "./Button.js";
import { StringSelectMenuComponent } from "./StringSelectMenu.js";

export type ActionRowResolvable = ButtonComponent | StringSelectMenuComponent;

export type ActionRowComponent = Component<
  {},
  ActionRowResolvable[] | ActionRowResolvable[][]
> & { type: "ActionRow" };
export function ActionRow(
  _props: {},
  children: ActionRowResolvable[]
): ActionRowComponent {
  return {
    type: "ActionRow",
    props: {},
    children,
  };
}
