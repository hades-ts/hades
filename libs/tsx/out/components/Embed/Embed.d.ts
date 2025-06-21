import { EmbedAuthorOptions, ColorResolvable, EmbedImageData, EmbedFooterOptions, APIEmbedField, EmbedBuilder } from "discord.js";
import { BuilderComponent, EmbedPropertyComponent } from "../../typings/types.js";
export type EmbedResolvable = EmbedAuthorComponent | EmbedFooterComponent | EmbedFieldsComponent | EmbedThumbnailComponent | EmbedImageComponent;
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
export declare const EmbedResolver: (props: EmbedProps, children: EmbedResolvable[]) => EmbedBuilder;
export declare function Embed(props: EmbedProps, children: EmbedResolvable[]): EmbedComponent;
export type EmbedAuthorComponent = EmbedPropertyComponent<EmbedAuthorOptions> & {
    type: "EmbedAuthor";
};
export declare function EmbedAuthor(props: EmbedAuthorOptions, _children: undefined): EmbedAuthorComponent;
export type EmbedFooterComponent = EmbedPropertyComponent<EmbedFooterOptions> & {
    type: "EmbedFooter";
};
export declare function EmbedBuilderFooter(props: EmbedFooterOptions, _children: undefined): EmbedFooterComponent;
export type EmbedFieldsComponent = EmbedPropertyComponent<{}, EmbedPropertyComponent[]> & {
    type: "EmbedFields";
};
export declare function EmbedFields(_props: any, children: EmbedFieldComponent[] | EmbedFieldComponent[][]): EmbedFieldsComponent;
export type EmbedFieldComponent = EmbedPropertyComponent<APIEmbedField> & {
    type: "EmbedField";
};
export declare function EmbedField(props: APIEmbedField, _children: undefined): EmbedFieldComponent;
export type EmbedThumbnailComponent = EmbedPropertyComponent<EmbedImageData> & {
    type: "EmbedThumbnail";
};
export declare function EmbedBuilderThumbnail(props: EmbedImageData, _children: undefined): EmbedThumbnailComponent;
export type EmbedImageComponent = EmbedPropertyComponent<EmbedImageData> & {
    type: "EmbedImage";
};
export declare function EmbedBuilderImage(props: EmbedImageData, _children: undefined): EmbedImageComponent;
//# sourceMappingURL=Embed.d.ts.map