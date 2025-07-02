import { ButtonStyle } from "discord.js";

import { command, SlashCommand } from "@hades-ts/slash-commands";
import {
    ActionRow,
    Button,
    ChannelSelectMenu,
    DiscordComponents,
    LinkButton,
    RoleSelectMenu,
    SelectMenuOption,
    StringSelectMenu,
    UserSelectMenu,
} from "@hades-ts/tsx";

const ui = (custom) => (
    <>
        <ActionRow>
            <Button
                style={ButtonStyle.Primary}
                label={custom}
                customId="primary"
            />
            <Button
                style={ButtonStyle.Secondary}
                label="Secondary"
                customId="secondary"
            />
            <Button
                style={ButtonStyle.Danger}
                label="Danger"
                customId="danger"
            />
            <Button
                style={ButtonStyle.Success}
                label="Success"
                customId="success"
            />
            <LinkButton
                style={ButtonStyle.Link}
                label="Link"
                url="https://discord.js.org"
            />
        </ActionRow>
        <ActionRow>
            <StringSelectMenu customId="select" placeholder="Select an option">
                <SelectMenuOption
                    description="This is the first option"
                    label="First"
                    value="first"
                />
                <SelectMenuOption
                    description="This is the second option"
                    label="Second"
                    value="second"
                />
                <SelectMenuOption
                    description="This is the third option"
                    label="Third"
                    value="third"
                    emoji="🥉"
                />
            </StringSelectMenu>
        </ActionRow>
        <ActionRow>
            <UserSelectMenu customId="user" placeholder="Select a user" />
        </ActionRow>
        <ActionRow>
            <RoleSelectMenu customId="role" placeholder="Select a role" />
        </ActionRow>
        <ActionRow>
            <ChannelSelectMenu
                maxValues={5}
                customId="channel"
                placeholder="Select a channel"
            />
        </ActionRow>
    </>
);

@command("tsx", { description: "Test the tsx library." })
export class TSXTestCommand extends SlashCommand {
    async execute(): Promise<void> {
        await this.interaction.reply({ ...ui("Hello") });
    }
}
