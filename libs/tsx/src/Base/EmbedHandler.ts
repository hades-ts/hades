import { EmbedBuilder } from "discord.js";
import { EmbedComponent } from "../components/Embed/Embed.js";

export default function handleData(component: EmbedComponent) {
  const props = component.props;
  const embed = new EmbedBuilder();

  if (props.color) embed.setColor(props.color);
  if (props.timestamp) embed.setTimestamp(props.timestamp);
  if (props.description) embed.setDescription(props.description);
  if (props.title) embed.setTitle(props.title);
  if (props.url) embed.setURL(props.url);

  component.children?.forEach((child) => {
    switch (child.type) {
      case "EmbedFields":
        {
          if (!child.children) {
            break;
          }
          const fieldData = child.children.flat().map((f) => f.props);
          void embed.addFields(fieldData);
        }
        break;
      case "EmbedAuthor":
        {
          embed.setAuthor(child.props);
        }
        break;
      case "EmbedFooter":
        {
          embed.setFooter(child.props);
        }
        break;
      case "EmbedImage":
        {
          embed.setImage(child.props.url);
        }
        break;
      case "EmbedThumbnail":
        {
          embed.setThumbnail(child.props.url);
        }
        break;
      default:
        throw new TypeError(`Unexpected child value "${child}"!`);
    }
  });

  return embed;
}
