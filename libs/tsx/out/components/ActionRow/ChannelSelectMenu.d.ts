import { ChannelSelectMenuBuilder, ChannelSelectMenuComponentData } from "discord.js";
import { BuilderComponent } from "../../typings/types.js";
export type ChannelSelectMenuOptions = Omit<ChannelSelectMenuComponentData, "type" | "options">;
export type ChannelSelectMenuComponent = BuilderComponent<ChannelSelectMenuBuilder, ChannelSelectMenuOptions, undefined> & {
    type: "ChannelSelectMenu";
};
export declare const ChannelSelectMenuResolver: (props: ChannelSelectMenuOptions) => ChannelSelectMenuBuilder;
export declare function ChannelSelectMenu(props: ChannelSelectMenuOptions): ChannelSelectMenuComponent;
//# sourceMappingURL=ChannelSelectMenu.d.ts.map