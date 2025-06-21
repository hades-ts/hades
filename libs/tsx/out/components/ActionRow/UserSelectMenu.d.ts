import { UserSelectMenuBuilder, UserSelectMenuComponentData } from "discord.js";
import { BuilderComponent } from "../../typings/types.js";
export type UserSelectMenuOptions = Omit<UserSelectMenuComponentData, "type" | "options">;
export type UserSelectMenuComponent = BuilderComponent<UserSelectMenuBuilder, UserSelectMenuOptions, undefined> & {
    type: "UserSelectMenu";
};
export declare const UserSelectMenuResolver: (props: UserSelectMenuOptions) => UserSelectMenuBuilder;
export declare function UserSelectMenu(props: UserSelectMenuOptions): UserSelectMenuComponent;
//# sourceMappingURL=UserSelectMenu.d.ts.map