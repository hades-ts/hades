import {
    EmbedAuthorOptions,
    ColorResolvable,
    EmbedImageData,
    EmbedFooterOptions,
    APIEmbedField,
    EmbedBuilder,
} from "discord.js";
import { BuilderComponent, EmbedPropertyComponent } from "../../typings/types.js";

export type EmbedResolvable =
    | EmbedAuthorComponent
    | EmbedFooterComponent
    | EmbedFieldsComponent
    | EmbedThumbnailComponent
    | EmbedImageComponent;

export interface EmbedProps {
    color?: ColorResolvable;
    timestamp?: Date | number;
    description?: string;
    title?: string;
    url?: string;
}

export type EmbedComponent = BuilderComponent<EmbedBuilder, EmbedProps, EmbedResolvable[]> & {
    type: "Embed";
};

export const EmbedResolver = (props: EmbedProps, children: EmbedResolvable[]) => {
    const embed = new EmbedBuilder();
    const { color, timestamp, description, title, url } = props;

    if (color) embed.setColor(color);
    if (timestamp) embed.setTimestamp(timestamp);
    if (description) embed.setDescription(description);
    if (title) embed.setTitle(title);
    if (url) embed.setURL(url);

    for (const child of children) {
        if (typeof child === "object" && "type" in child) {
            child.resolve(embed, child.props as any, child.children as any);
        }
    }

    return embed;
}

export function Embed(
    props: EmbedProps,
    children: EmbedResolvable[]
): EmbedComponent {
    return {
        type: "Embed" as const,
        props,
        children,
        resolve: EmbedResolver,
    };
}

export type EmbedAuthorComponent = EmbedPropertyComponent<EmbedAuthorOptions> & {
    type: "EmbedAuthor";
};

export function EmbedAuthor(
    props: EmbedAuthorOptions,
    _children: undefined
): EmbedAuthorComponent {
    return {
        type: "EmbedAuthor",
        props,
        resolve: (builder: EmbedBuilder, props: EmbedAuthorOptions) => {
            builder.setAuthor(props);
        },
    };
}

export type EmbedFooterComponent = EmbedPropertyComponent<EmbedFooterOptions> & {
    type: "EmbedFooter";
};

export function EmbedBuilderFooter(
    props: EmbedFooterOptions,
    _children: undefined
): EmbedFooterComponent {
    return {
        type: "EmbedFooter",
        props,
        resolve: (builder: EmbedBuilder, props: EmbedFooterOptions) => {
            builder.setFooter(props);
        },
    };
}

export type EmbedFieldsComponent = EmbedPropertyComponent<{}, EmbedPropertyComponent[]> & { type: "EmbedFields" };

export function EmbedFields(
    _props: any,
    children: EmbedFieldComponent[] | EmbedFieldComponent[][]
): EmbedFieldsComponent {
    return {
        type: "EmbedFields",
        props: {},
        resolve: (builder: EmbedBuilder, props: {}, children: EmbedPropertyComponent[]) => {
            children.forEach(child => child.resolve(builder, child.props as any, child.children as any))
        },
    };
}

export type EmbedFieldComponent = EmbedPropertyComponent<APIEmbedField> & {
    type: "EmbedField";
};

export function EmbedField(
    props: APIEmbedField,
    _children: undefined
): EmbedFieldComponent {
    return {
        type: "EmbedField",
        props,
        resolve: (builder: EmbedBuilder, props: APIEmbedField) => {
            builder.addFields(props);
        },
    };
}

export type EmbedThumbnailComponent = EmbedPropertyComponent<EmbedImageData> & {
    type: "EmbedThumbnail";
};
export function EmbedBuilderThumbnail(
    props: EmbedImageData,
    _children: undefined
): EmbedThumbnailComponent {
    return {
        type: "EmbedThumbnail",
        props,
        resolve: (builder: EmbedBuilder, props: EmbedImageData) => {
            builder.setThumbnail(props.url);
        },
    };
}

export type EmbedImageComponent = EmbedPropertyComponent<EmbedImageData> & {
    type: "EmbedImage";
};
export function EmbedBuilderImage(
    props: EmbedImageData,
    _children: undefined
): EmbedImageComponent {
    return {
        type: "EmbedImage",
        props,
        resolve: (builder: EmbedBuilder, props: EmbedImageData) => {
            builder.setImage(props.url);
        },
    };
}
