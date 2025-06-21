import { SelectMenuComponentOptionData, SelectMenuOptionBuilder, StringSelectMenuBuilder, StringSelectMenuComponentData, StringSelectMenuOptionBuilder } from "discord.js";
import { BuilderComponent } from "../../typings/types.js";
export type StringSelectMenuOptions = Omit<StringSelectMenuComponentData, "type" | "options">;
export type StringSelectMenuComponent = BuilderComponent<StringSelectMenuBuilder, StringSelectMenuOptions, SelectMenuOptionComponent[] | SelectMenuOptionComponent[][]> & {
    type: "StringSelectMenu";
};
export declare const StringSelectMenuResolver: (props: StringSelectMenuOptions, children: SelectMenuOptionComponent[] | SelectMenuOptionComponent[][]) => StringSelectMenuBuilder;
export declare function StringSelectMenu(props: StringSelectMenuOptions, children: SelectMenuOptionComponent[] | SelectMenuOptionComponent[][]): StringSelectMenuComponent;
export type SelectMenuOptionOptions = SelectMenuComponentOptionData;
export type SelectMenuOptionComponent = BuilderComponent<StringSelectMenuOptionBuilder, SelectMenuComponentOptionData, undefined> & {
    type: "SelectMenuOption";
};
export declare const SelectMenuOptionResolver: (props: SelectMenuComponentOptionData) => SelectMenuOptionBuilder;
export declare function SelectMenuOption(props: SelectMenuComponentOptionData): SelectMenuOptionComponent;
//# sourceMappingURL=StringSelectMenu.d.ts.map