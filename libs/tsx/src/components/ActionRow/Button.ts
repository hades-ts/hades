import { ButtonComponentData } from "discord.js";
import { Component } from "../../typings/types.js";

export type ButtonOptions = Partial<ButtonComponentData>;

export type ButtonComponent = Component<
  ButtonOptions & { customId?: string; url?: string },
  undefined
> & { type: "Button" };
export function Button(
  props: ButtonOptions & {
    customId?: string;
    url?: string;
  },
  _children: undefined
): ButtonComponent {
  return {
    type: "Button",
    props,
    children: undefined,
  };
}
