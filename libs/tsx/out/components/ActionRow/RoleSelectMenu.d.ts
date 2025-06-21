import { RoleSelectMenuBuilder, RoleSelectMenuComponentData } from "discord.js";
import { BuilderComponent } from "../../typings/types.js";
export type RoleSelectMenuOptions = Omit<RoleSelectMenuComponentData, "type" | "options">;
export type RoleSelectMenuComponent = BuilderComponent<RoleSelectMenuBuilder, RoleSelectMenuOptions, undefined> & {
    type: "RoleSelectMenu";
};
export declare const RoleSelectMenuResolver: (props: RoleSelectMenuOptions) => RoleSelectMenuBuilder;
export declare function RoleSelectMenu(props: RoleSelectMenuOptions): RoleSelectMenuComponent;
//# sourceMappingURL=RoleSelectMenu.d.ts.map