# discord.tsx

Create Discord.js components in JSX.

**[https://www.npmjs.com/package/discord.tsx](https://www.npmjs.com/package/discord.tsx)**

# Setup

## Install discord.js

```sh
$ npm i discord.js
```

# Env Setup

## TypeScript

### Add these in your **`tsconfig.json`#compilerOptions**

```json
"jsx": "react",
"jsxFactory": "DiscordComponents.createComponent",
"jsxFragmentFactory": "DiscordComponents.Fragment"
```

## Babel

Specify pragma for custom jsx factory with **[`@babel/plugin-transform-react-jsx`](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)**.

```jsx
/** @jsx DiscordComponents.createComponent */
/** @jsxFrag DiscordComponents.Fragment */
```

# Components Available

- ActionRow
- Button
- StringSelectMenu
- Embed

## Root Fragment Data

Root fragment: `<>...</>` returns `{ embeds: Embed[], components: ActionRow[] }`.

# Example

## Single Row

```tsx
import { ButtonStyle } from "discord.js";
import { DiscordComponents, ActionRow, Button } from "discord.tsx";

client.on("messageCreate", (message) => {
  if (message.content === "=btn") {
    const componentData = (
      <>
        <ActionRow>
          <Button style={ButtonStyle["Primary"]} label="Primary" customId="primary" />
          <Button style={ButtonStyle["Secondary"]} label="Secondary" customId="secondary" />
          <Button style={ButtonStyle["Danger"]} label="Danger" customId="danger" />
          <Button style={ButtonStyle["Success"]} label="Success" customId="success" />
          <Button style={ButtonStyle["Link"]} label="Link" url="https://discord.js.org" />
        </ActionRow>
      </>
    );

    return message.channel.send({ ...componentData, content: "Buttons 🖱" });
  }
});
```

### Preview

![](https://i.imgur.com/IuEqtdy.png)

## Or Multiple

```tsx
import { ButtonStyle } from "discord.js";
import { DiscordComponents, ActionRow, Button } from "discord.tsx";

client.on("messageCreate", (message) => {
  if (message.content === "=btn") {
    const componentData = (
      <>
        <ActionRow>
          <Button style={ButtonStyle["Primary"]} label="Primary" customId="primary" />
          <Button style={ButtonStyle["Secondary"]} label="Secondary" customId="secondary" />
          <Button style={ButtonStyle["Danger"]} label="Danger" customId="danger" />
          <Button style={ButtonStyle["Success"]} label="Success" customId="success" />
          <Button style={ButtonStyle["Link"]} label="Link" url="https://discord.js.org" />
        </ActionRow>
        <ActionRow>
          <Button style={ButtonStyle["Primary"]} label="Primary 2" customId="primary2" />
          <Button style={ButtonStyle["Secondary"]} label="Secondary 2" customId="secondary2" />
          <Button style={ButtonStyle["Danger"]} label="Danger 2" customId="danger2" />
          <Button style={ButtonStyle["Success"]} label="Success 2" customId="success2" />
          <Button style={ButtonStyle["Link"]} label="Link 2" url="https://discord.js.org" />
        </ActionRow>
      </>
    );

    return message.channel.send({ ...componentData, content: "Buttons 🖱" });
  }
});
```

### Preview

![](https://i.imgur.com/KxHMgn2.png)

## Select Menu

```tsx
import { DiscordComponents, ActionRow, StringSelectMenu, SelectMenuOption } from "discord.tsx";

client.on("messageCreate", (message) => {
  if (message.content === "=select") {
    const componentData = (
      <>
        <ActionRow>
          <StringSelectMenu>
            <SelectMenuOption default={true} description="This is the first option" label="First" value="first" />
            <SelectMenuOption description="This is the second option" label="Second" value="second" />
            <SelectMenuOption description="This is the third option" label="Third" value="third" emoji="🥉" />
          </StringSelectMenu>
        </ActionRow>
      </>
    );

    return message.channel.send({ ...componentData, content: "Select It" });
  }
});
```

### Preview

![](https://i.imgur.com/EmeGYYy.png)

## Message Embed

```tsx
import { DiscordComponents, Embed, EmbedAuthor, EmbedFields, EmbedField, EmbedFooter, EmbedImage, EmbedThumbnail } from "discord.tsx";

client.on("messageCreate", (message) => {
  if (message.content === "=embed") {
    const componentData = (
      <>
        <Embed color="Random" timestamp={Date.now()} description="Hello World" url="https://github.com" title="Title">
          <EmbedAuthor name="Author" iconURL="https://cdn.discordapp.com/emojis/828572926525177887.png?v=1" url="https://discord.com" />
          <EmbedFields>
            <EmbedField name="Hello" value="world" />
            <EmbedField name="Goodbye" value="world" inline />
          </EmbedFields>
          <EmbedThumbnail url="https://cdn.discordapp.com/emojis/828572926525177887.png?v=1" />
          <EmbedImage url="https://cdn.discordapp.com/emojis/828572926525177887.png?v=1" />
          <EmbedFooter text="Footer" iconURL="https://cdn.discordapp.com/emojis/828572926525177887.png?v=1" />
        </Embed>
      </>
    );

    return message.channel.send(componentData);
  }
});
```

### Preview

![](https://i.imgur.com/eaqub2x.png)

## Other examples

```tsx
const componentData = (
  <>
    <ActionRow>
      {Array.from({ length: 5 }, (_, i) => (
        <Button style={ButtonStyle["Primary"]} label={`Button ${++i}`} customId={`btn_${i}`} />
      ))}
    </ActionRow>
    <ActionRow>
      <StringSelectMenu customId="123">
        {Array.from({ length: 5 }, (_, i) => (
          <SelectMenuOption description={`Option number ${++i}`} label={`Option ${i}`} value={i.toString()} />
        ))}
      </StringSelectMenu>
    </ActionRow>
    <Embed color="Blurple" title="Counter">
      <EmbedFields>
        {Array.from({ length: 10 }, (_, i) => {
          const counter = ++i;
          return <EmbedField name={`Count ${counter}`} value={`Counting ${counter}`} />;
        })}
      </EmbedFields>
    </Embed>
  </>
);

return message.channel.send(componentData);
```
