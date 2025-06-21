import { ButtonStyle } from "discord.js";
import {
  DiscordComponents,
  ActionRow,
  StringSelectMenu,
  SelectMenuOption,
  MessageButton,
  Embed,
  EmbedFields,
  EmbedField,
} from "../../out/index.js";

const components = (
  <>
    <ActionRow>
      {Array.from({ length: 5 }, (_, i) => (
        <MessageButton
          style={ButtonStyle["Primary"]}
          label={`Button ${++i}`}
          customId={`btn_${i}`}
        />
      ))}
    </ActionRow>
    <ActionRow>
      <StringSelectMenu customId="123">
        {Array.from({ length: 5 }, (_, i) => (
          <SelectMenuOption
            description={`Option number ${++i}`}
            label={`Option ${i}`}
            value={i.toString()}
          />
        ))}
      </StringSelectMenu>
    </ActionRow>
    <Embed color="Blurple" title="Counter">
      <EmbedFields>
        {Array.from({ length: 10 }, (_, i) => {
          const counter = ++i;
          return (
            <EmbedField
              name={`Count ${counter}`}
              value={`Counting ${counter}`}
            />
          );
        })}
      </EmbedFields>
    </Embed>
  </>
);

console.log("TYPESCRIPT", components);
