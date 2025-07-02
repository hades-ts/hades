/** @jsx DiscordComponents.createComponent */
/** @jsxFrag DiscordComponents.Fragment */

import { ButtonStyle } from "discord.js";

import {
    ActionRow,
    Button,
    // biome-ignore lint/correctness/noUnusedImports: JSX
    DiscordComponents,
    Embed,
    EmbedField,
    EmbedFields,
    SelectMenuOption,
    StringSelectMenu,
} from "../../dist/index.js";

const components = (
    <>
        <ActionRow>
            {Array.from({ length: 5 }, (_, i) => (
                <Button
                    style={ButtonStyle.Primary}
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

console.log("BABEL", components);
