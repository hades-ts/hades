import { UserSelectMenuBuilder, UserSelectMenuComponentData } from "discord.js";
import { BuilderComponent } from "../../typings/types.js";

export type UserSelectMenuOptions = Omit<
    UserSelectMenuComponentData,
    "type" | "options"
>;

export type UserSelectMenuComponent = BuilderComponent<
    UserSelectMenuBuilder,
    UserSelectMenuOptions,
    undefined
> & {
    type: "UserSelectMenu";
};

export const UserSelectMenuResolver = (props: UserSelectMenuOptions) => {
    const userSelectMenu = new UserSelectMenuBuilder();
    const { customId, placeholder } = props;

    if (customId) userSelectMenu.setCustomId(customId);
    if (placeholder) userSelectMenu.setPlaceholder(placeholder);

    if (!placeholder) {
        userSelectMenu.setPlaceholder("Select a user");
    }

    return userSelectMenu;
};

export function UserSelectMenu(
    props: UserSelectMenuOptions,
): UserSelectMenuComponent {
    return {
        type: "UserSelectMenu",
        props,
        resolve: UserSelectMenuResolver,
    };
}
