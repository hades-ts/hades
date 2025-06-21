import { ButtonBuilder, InteractionButtonComponentData, LinkButtonComponentData } from "discord.js";
import { BuilderComponent } from "../../typings/types.js";
export type ButtonOptions = Omit<InteractionButtonComponentData, "type">;
export type ButtonComponent = BuilderComponent<ButtonBuilder, ButtonOptions, undefined> & {
    type: "Button";
};
export declare const ButtonResolver: (props: ButtonOptions) => ButtonBuilder;
export declare function Button(props: ButtonOptions): ButtonComponent;
export type LinkButtonOptions = Omit<LinkButtonComponentData, "type">;
export type LinkButtonComponent = BuilderComponent<ButtonBuilder, LinkButtonOptions, undefined> & {
    type: "LinkButton";
};
export declare const LinkButtonResolver: (props: LinkButtonOptions) => ButtonBuilder;
export declare function LinkButton(props: LinkButtonOptions): LinkButtonComponent;
//# sourceMappingURL=Button.d.ts.map