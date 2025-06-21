import { ActionRowBuilder, EmbedBuilder } from "discord.js";
import { Atom, ComponentFactory, Component, ComponentPropTypes, FragmentResolvable } from "../typings/types";
export declare class DiscordComponents {
    static createComponent<P = ComponentPropTypes>(component: ComponentFactory<P>, props: P, ...children: Atom[]): Component<P>;
    static Fragment(props: null, children: FragmentResolvable[]): {
        embeds: EmbedBuilder[];
        components: ActionRowBuilder[];
    };
}
//# sourceMappingURL=DiscordComponents.d.ts.map