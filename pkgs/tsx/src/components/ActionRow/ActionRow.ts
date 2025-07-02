import { ActionRowBuilder } from "discord.js";

import type { BuilderComponent } from "../../typings/types.js";
import type { ButtonComponent } from "./Button.js";
import type { ChannelSelectMenuComponent } from "./ChannelSelectMenu.js";
import type { RoleSelectMenuComponent } from "./RoleSelectMenu.js";
import type { StringSelectMenuComponent } from "./StringSelectMenu.js";
import type { UserSelectMenuComponent } from "./UserSelectMenu.js";

export type ActionRowResolvable =
    | ButtonComponent
    | StringSelectMenuComponent
    | UserSelectMenuComponent
    | RoleSelectMenuComponent
    | ChannelSelectMenuComponent;

export type ActionRowComponent = BuilderComponent<
    ActionRowBuilder,
    {},
    ActionRowResolvable[] | ActionRowResolvable[][]
> & { type: "ActionRow" };

export const ActionRowResolver = (
    _props: {},
    children?: ActionRowResolvable[] | ActionRowResolvable[][],
) => {
    const actionRow = new ActionRowBuilder();

    if (!children?.length) return actionRow;

    for (const child of children) {
        if (typeof child === "object" && "type" in child) {
            actionRow.addComponents(
                child.resolve(child.props as any, child.children as any),
            );
        }
    }

    return actionRow;
};

export function ActionRow(
    _props: {},
    children: ActionRowResolvable[],
): ActionRowComponent {
    return {
        type: "ActionRow",
        props: {},
        children,
        resolve: ActionRowResolver,
    };
}
