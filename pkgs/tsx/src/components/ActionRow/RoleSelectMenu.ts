import {
    RoleSelectMenuBuilder,
    type RoleSelectMenuComponentData,
} from "discord.js";

import type { BuilderComponent } from "../../typings/types.js";

export type RoleSelectMenuOptions = Omit<
    RoleSelectMenuComponentData,
    "type" | "options"
>;

export type RoleSelectMenuComponent = BuilderComponent<
    RoleSelectMenuBuilder,
    RoleSelectMenuOptions,
    undefined
> & {
    type: "RoleSelectMenu";
};

export const RoleSelectMenuResolver = (props: RoleSelectMenuOptions) => {
    const roleSelectMenu = new RoleSelectMenuBuilder();
    const { customId, placeholder } = props;

    if (customId) roleSelectMenu.setCustomId(customId);
    if (placeholder) roleSelectMenu.setPlaceholder(placeholder);

    if (!placeholder) {
        roleSelectMenu.setPlaceholder("Select a role");
    }

    return roleSelectMenu;
};

export function RoleSelectMenu(
    props: RoleSelectMenuOptions,
): RoleSelectMenuComponent {
    return {
        type: "RoleSelectMenu",
        props,
        resolve: RoleSelectMenuResolver,
    };
}
