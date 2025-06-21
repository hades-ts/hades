import { BuilderComponent } from "../../typings/types.js";
import { ButtonComponent } from "./Button.js";
import { StringSelectMenuComponent } from "./StringSelectMenu.js";
import { UserSelectMenuComponent } from "./UserSelectMenu.js";
import { RoleSelectMenuComponent } from "./RoleSelectMenu.js";
import { ChannelSelectMenuComponent } from "./ChannelSelectMenu.js";
import { ActionRowBuilder } from "discord.js";
export type ActionRowResolvable = ButtonComponent | StringSelectMenuComponent | UserSelectMenuComponent | RoleSelectMenuComponent | ChannelSelectMenuComponent;
export type ActionRowComponent = BuilderComponent<ActionRowBuilder, {}, ActionRowResolvable[] | ActionRowResolvable[][]> & {
    type: "ActionRow";
};
export declare const ActionRowResolver: (props: {}, children: ActionRowResolvable[] | ActionRowResolvable[][]) => ActionRowBuilder<import("discord.js").AnyComponentBuilder>;
export declare function ActionRow(_props: {}, children: ActionRowResolvable[]): ActionRowComponent;
//# sourceMappingURL=ActionRow.d.ts.map