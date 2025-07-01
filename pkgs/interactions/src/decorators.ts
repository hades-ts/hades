import { createClassCategoric } from "@ldlework/categoric-decorators";
import type {
    ApplicationCommandType,
    AutocompleteInteraction,
    BaseInteraction,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChatInputCommandInteraction,
    ComponentType,
    InteractionType,
    MentionableSelectMenuInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    PrimaryEntryPointCommandInteraction,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserContextMenuCommandInteraction,
    UserSelectMenuInteraction,
} from "discord.js";
import type { Newable } from "inversify";

export const [_interaction, findInteractions] = createClassCategoric<{
    type: InteractionType;
    subType: ApplicationCommandType | ComponentType | undefined;
}>();

export type InteractionSubType<T extends InteractionType> =
    T extends InteractionType.ApplicationCommand
        ? ApplicationCommandType
        : T extends InteractionType.MessageComponent
          ? ComponentType
          : T extends InteractionType.ApplicationCommandAutocomplete
            ? never
            : T extends InteractionType.ModalSubmit
              ? never
              : never;

export type InteractionHandlerParam<
    T extends InteractionType,
    TSub extends InteractionSubType<T>,
> = T extends InteractionType.ApplicationCommand
    ? TSub extends ApplicationCommandType.ChatInput
        ? ChatInputCommandInteraction
        : TSub extends ApplicationCommandType.User
          ? UserContextMenuCommandInteraction
          : TSub extends ApplicationCommandType.Message
            ? MessageContextMenuCommandInteraction
            : TSub extends ApplicationCommandType.PrimaryEntryPoint
              ? PrimaryEntryPointCommandInteraction
              : never
    : T extends InteractionType.MessageComponent
      ? TSub extends ComponentType.Button
          ? ButtonInteraction
          : TSub extends ComponentType.StringSelect
            ? StringSelectMenuInteraction
            : TSub extends ComponentType.UserSelect
              ? UserSelectMenuInteraction
              : TSub extends ComponentType.RoleSelect
                ? RoleSelectMenuInteraction
                : TSub extends ComponentType.MentionableSelect
                  ? MentionableSelectMenuInteraction
                  : TSub extends ComponentType.ChannelSelect
                    ? ChannelSelectMenuInteraction
                    : never
      : T extends InteractionType.ApplicationCommandAutocomplete
        ? AutocompleteInteraction
        : T extends InteractionType.ModalSubmit
          ? ModalSubmitInteraction
          : BaseInteraction;

type InteractionHandler<
    T extends InteractionType,
    TSub extends InteractionSubType<T>,
> = (interaction: InteractionHandlerParam<T, TSub>) => Promise<void>;

export function interaction<
    T extends InteractionType,
    TSub extends InteractionSubType<T>,
>(it: T, sub: TSub) {
    return <N extends Record<"execute", InteractionHandler<T, TSub>>>(
        target: Newable<N>,
    ) => {
        console.log(
            `Decorating ${target.name} with interaction ${it} and subType ${sub}`,
        );
        _interaction({ type: it, subType: sub })(target);
    };
}

// @interaction(
//     InteractionType.ApplicationCommand,
//     ApplicationCommandType.ChatInput,
// )
// export class Foo {
//     async execute(interaction: ChatInputCommandInteraction) {
//         console.log(interaction);
//     }
// }

// @interaction(InteractionType.MessageComponent, ComponentType.Button)
// export class Bar {
//     async execute(interaction: ButtonInteraction) {
//         console.log(interaction);
//     }
// }
