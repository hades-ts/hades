import {
    SelectMenuComponentOptionData,
    StringSelectMenuBuilder,
    StringSelectMenuComponentData,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import { BuilderComponent } from "../../typings/types.js";

export type StringSelectMenuOptions = Omit<
    StringSelectMenuComponentData,
    "type" | "options"
>;

export type StringSelectMenuComponent = BuilderComponent<
    StringSelectMenuBuilder,
    StringSelectMenuOptions,
    SelectMenuOptionComponent[] | SelectMenuOptionComponent[][]
> & { type: "StringSelectMenu" };

// function extractOptions(children: any): StringSelectMenuOptionBuilder[] {
//   if (!children) return [];

//   const childArray = Array.isArray(children) ? children : [children];
//   return childArray.map(createOption);
// }

// function createOption(option: SelectMenuOptionComponent): StringSelectMenuOptionBuilder {
//   const builder = new StringSelectMenuOptionBuilder();
//   const { default: isDefault, description, label, value, emoji } = option.props;

//   if (isDefault) builder.setDefault(isDefault);
//   if (description) builder.setDescription(description);
//   if (label) builder.setLabel(label);
//   if (value) builder.setValue(value);
//   if (emoji) builder.setEmoji(emoji);

//   return builder;
// }

export const StringSelectMenuResolver = (
    props: StringSelectMenuOptions,
    children?: SelectMenuOptionComponent[] | SelectMenuOptionComponent[][],
) => {
    const selectMenu = new StringSelectMenuBuilder();
    const { customId, placeholder } = props;

    // Set properties if they exist
    if (customId) selectMenu.setCustomId(customId);
    placeholder
        ? selectMenu.setPlaceholder(placeholder)
        : selectMenu.setPlaceholder("Select an option!!");

    if (!children?.length) return selectMenu;

    const options = children.flat().map((child) => child.resolve(child.props));

    if (options.length > 0) {
        selectMenu.addOptions(options);
    }

    return selectMenu;
};

export function StringSelectMenu(
    props: StringSelectMenuOptions,
    children: SelectMenuOptionComponent[] | SelectMenuOptionComponent[][],
): StringSelectMenuComponent {
    return {
        type: "StringSelectMenu",
        props,
        children,
        resolve: StringSelectMenuResolver,
    };
}

export type SelectMenuOptionOptions = SelectMenuComponentOptionData;

export type SelectMenuOptionComponent = BuilderComponent<
    StringSelectMenuOptionBuilder,
    SelectMenuComponentOptionData,
    undefined
> & { type: "SelectMenuOption" };

export const SelectMenuOptionResolver = (
    props: SelectMenuComponentOptionData,
) => {
    const selectMenuOption = new StringSelectMenuOptionBuilder();
    const { label, value, description, emoji } = props;

    if (label) selectMenuOption.setLabel(label);
    if (value) selectMenuOption.setValue(value);
    if (description) selectMenuOption.setDescription(description);
    if (emoji) selectMenuOption.setEmoji(emoji);

    return selectMenuOption;
};

export function SelectMenuOption(
    props: SelectMenuComponentOptionData,
): SelectMenuOptionComponent {
    return {
        type: "SelectMenuOption",
        props,
        resolve: SelectMenuOptionResolver,
    };
}
