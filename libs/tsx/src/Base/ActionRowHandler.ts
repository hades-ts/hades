import {
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
} from "discord.js";
import {
    ActionRowComponent,
    ActionRowResolvable,
} from "../components/ActionRow/ActionRow.js";
import { SelectMenuOptionComponent } from "../components/index.js";

export default function handleData(
    component: ActionRowComponent | ActionRowResolvable[],
): ActionRowBuilder {
    const actionRow = new ActionRowBuilder();

    for (const child of Array.isArray(component)
        ? component
        : (component.children ?? [])) {
        child;
        if (Array.isArray(child)) {
            if (child.length === 0) continue;
            return handleData(child);
        }
        switch (child.type) {
            case "Button":
                {
                    const buttonComponent = new ButtonBuilder();
                    const prop = child.props;

                    if (prop.customId) buttonComponent.setCustomId(prop.customId);
                    if (prop.disabled) buttonComponent.setDisabled(prop.disabled);
                    if (prop.emoji) buttonComponent.setEmoji(prop.emoji);
                    if (prop.label) buttonComponent.setLabel(prop.label);
                    if (prop.style) buttonComponent.setStyle(prop.style);
                    if (prop.url) buttonComponent.setURL(prop.url);

                    actionRow.addComponents(buttonComponent);
                }
                break;
            case "StringSelectMenu":
                {
                    const selectMenu = new StringSelectMenuBuilder(child.props);
                    // const prop = child.props;

                    // if (prop.customId) selectMenu.setCustomId(prop.customId);
                    // if (prop.disabled) selectMenu.setDisabled(prop.disabled);
                    // if (prop.maxValues) selectMenu.setMaxValues(prop.maxValues);
                    // if (prop.minValues) selectMenu.setMinValues(prop.minValues);
                    // if (prop.placeholder) selectMenu.setPlaceholder(prop.placeholder);

                    // add options
                    const applyOptions = (
                        comp: SelectMenuOptionComponent[] | SelectMenuOptionComponent[][],
                    ): void => {
                        for (const selectMenuChild of comp) {
                            if (Array.isArray(selectMenuChild)) {
                                return applyOptions(selectMenuChild);
                            }

                            return void selectMenu.addOptions(selectMenuChild.props);
                        }
                    };

                    applyOptions(child.children ?? []);

                    actionRow.addComponents(selectMenu);
                }
                break;
            default:
                throw new Error(`Invalid child component: "${child}"!`);
        }
    }

    return actionRow;
}
