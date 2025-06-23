import { ButtonBuilder, InteractionButtonComponentData, LinkButtonComponentData } from "discord.js";
import { BuilderComponent } from "../../typings/types.js";

export type ButtonOptions = Omit<InteractionButtonComponentData, "type">;

export type ButtonComponent = BuilderComponent<ButtonBuilder, ButtonOptions, undefined> & { type: "Button" };

export const ButtonResolver = (props: ButtonOptions) => {
    const button = new ButtonBuilder();
    const { customId, style, label, emoji } = props;

    if (customId) button.setCustomId(customId);
    if (style) button.setStyle(style);
    if (label) button.setLabel(label);
    if (emoji) button.setEmoji(emoji);

    return button;
}

export function Button(props: ButtonOptions): ButtonComponent {
    return {
        type: "Button",
        props,
        resolve: ButtonResolver,
    };
}

export type LinkButtonOptions = Omit<LinkButtonComponentData, "type">;

export type LinkButtonComponent = BuilderComponent<ButtonBuilder, LinkButtonOptions, undefined> & { type: "LinkButton" };

export const LinkButtonResolver = (props: LinkButtonOptions) => {
    const button = new ButtonBuilder();
    const { url, style, label, emoji } = props;

    if (url) button.setURL(url);
    if (style) button.setStyle(style);
    if (label) button.setLabel(label);
    if (emoji) button.setEmoji(emoji);

    return button;
}

export function LinkButton(props: LinkButtonOptions): LinkButtonComponent {
    return {
        type: "LinkButton",
        props,
        resolve: LinkButtonResolver,
    };
}
