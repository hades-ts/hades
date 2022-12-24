import { EmbedBuilder } from "discord.js"
import { EmbedSchema } from "../schemas"


export const renderEmbedRecord = async (embedRecord: EmbedSchema) => {
    let embed = new EmbedBuilder()

    if (embedRecord.title) embed.setTitle(embedRecord.title)
    if (embedRecord.content) embed.setDescription(embedRecord.content)
    // if (embedRecord.color) embed.setColor(embedRecord.color)
    if (embedRecord.imageURL) embed.setImage(embedRecord.imageURL)
    if (embedRecord.thumbnailURL) embed.setThumbnail(embedRecord.thumbnailURL)
    if (embedRecord.author) 
        embed.setAuthor({
            name: embedRecord.author.name,
            iconURL: embedRecord.author.iconURL,
            url: embedRecord.author.url,
        })

    if (embedRecord.footer) 
        embed.setFooter({
            text: embedRecord.footer.text,
            iconURL: embedRecord.footer.iconURL,
        })

    embed.addFields(embedRecord.fields as Array<any>);
    return embed;
}