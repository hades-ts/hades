import {
    ChannelSelectMenuBuilder,
    ChannelSelectMenuComponentData,
} from "discord.js";
import { BuilderComponent } from "../../typings/types.js";

export type ChannelSelectMenuOptions = Omit<
    ChannelSelectMenuComponentData,
    "type" | "options"
>;

export type ChannelSelectMenuComponent = BuilderComponent<
    ChannelSelectMenuBuilder,
    ChannelSelectMenuOptions,
    undefined
> & {
    type: "ChannelSelectMenu";
};

export const ChannelSelectMenuResolver = (props: ChannelSelectMenuOptions) => {
    const channelSelectMenu = new ChannelSelectMenuBuilder();
    const { customId, placeholder, maxValues, minValues, channelTypes } = props;

    if (customId) channelSelectMenu.setCustomId(customId);
    if (placeholder) channelSelectMenu.setPlaceholder(placeholder);

    if (!placeholder) {
        channelSelectMenu.setPlaceholder("Select a channel");
    }

    if (maxValues) channelSelectMenu.setMaxValues(maxValues);
    if (minValues) channelSelectMenu.setMinValues(minValues);
    if (channelTypes) channelSelectMenu.addChannelTypes(...channelTypes);

    return channelSelectMenu;
};

export function ChannelSelectMenu(
    props: ChannelSelectMenuOptions,
): ChannelSelectMenuComponent {
    return {
        type: "ChannelSelectMenu",
        props,
        resolve: ChannelSelectMenuResolver,
    };
}
