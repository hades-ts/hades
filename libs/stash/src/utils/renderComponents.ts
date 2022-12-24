import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, EmbedBuilder } from "discord.js"
import { EmbedSchema } from "../schemas"


export const renderComponents = (embedRecord: EmbedSchema): ActionRowBuilder<ButtonBuilder> => {
    let row = new ActionRowBuilder<ButtonBuilder>()

    if (embedRecord.buttons) {
        console.log(JSON.stringify(embedRecord.buttons, null, 2))
    }    

    for (const button of embedRecord.buttons) {
        const buttonBuilder = new ButtonBuilder()
        let buttonStyle = ButtonStyle.Primary
        switch (button.style) {
            case "PRIMARY":
                buttonStyle = ButtonStyle.Primary
                break;
            case "SECONDARY":
                buttonStyle = ButtonStyle.Secondary
                break;
            case "SUCCESS":
                buttonStyle = ButtonStyle.Success
                break;
            case "DANGER":
                buttonStyle = ButtonStyle.Danger
                break;
            case "LINK":
                buttonStyle = ButtonStyle.Link
                break;
            default:
                buttonStyle = ButtonStyle.Primary
                break;
        }

        if (button.label) 
            buttonBuilder.setLabel(button.label)
        if (button.style) 
            buttonBuilder.setStyle(buttonStyle)
        if (button.customId) 
            buttonBuilder.setCustomId(button.customId)
        if (button.emoji) 
            buttonBuilder.setEmoji(button.emoji)
        if (button.url) 
            buttonBuilder.setURL(button.url)
        row.addComponents(buttonBuilder)
    }

    return row;    
}