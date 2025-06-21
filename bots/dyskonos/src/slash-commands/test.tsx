/** @jsx DiscordComponents.createComponent */
/** @jsxFrag DiscordComponents.Fragment */

import {
    DiscordComponents,
    ActionRow,
    Button,
} from "discord.tsx";
import { ButtonStyle } from "discord.js";


const ui = <>
    <ActionRow>
        <Button style={ButtonStyle.Primary} label="Primary" customId="primary" />
        <Button style={ButtonStyle.Secondary} label="Secondary" customId="secondary" />
        <Button style={ButtonStyle.Danger} label="Danger" customId="danger" />
        <Button style={ButtonStyle.Success} label="Success" customId="success" />
        <Button style={ButtonStyle.Link} label="Link" url="https://discord.js.org" />
    </ActionRow>
</>

export default ui;