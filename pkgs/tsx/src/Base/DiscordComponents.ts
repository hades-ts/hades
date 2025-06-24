import { ActionRowBuilder, EmbedBuilder } from "discord.js";
import {
    Atom,
    ComponentFactory,
    Component,
    ComponentPropTypes,
    FragmentResolvable,
} from "../typings/types";

export class DiscordComponents {
    static createComponent<P = ComponentPropTypes>(
        component: ComponentFactory<P>,
        props: P,
        ...children: Atom[]
    ): Component<P> {
        if (component === undefined) return void 0 as any;
        const element = component(props, children);
        return element;
    }

    static Fragment(
        props: null,
        children: FragmentResolvable[],
    ): { embeds: EmbedBuilder[]; components: ActionRowBuilder[] } {
        if (props !== null)
            throw new TypeError("Root fragments must not have props.");

        const components: ActionRowBuilder[] = [];
        const embeds: EmbedBuilder[] = [];

        if (!children || children.length === 0) return { components, embeds }; // Nothing to process.

        children.forEach((atom) => {
            // Only process if atom is a Component
            if (typeof atom !== "object" || atom === null || !("type" in atom))
                return;

            switch (atom.type) {
                case "ActionRow":
                    components.push(atom.resolve(atom.props, atom.children));
                    break;
                case "Embed":
                    embeds.push(atom.resolve(atom.props, atom.children));
                    break;
                default:
                    throw new TypeError(`Unsupported parent component: "${atom}"!`);
            }
        });

        return {
            embeds,
            components,
        };
    }
}
