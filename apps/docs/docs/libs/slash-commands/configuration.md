# Configuration

To enable Slash Commands, add the `SlashCommandsInstaller` to your `HadesContainer`:

```ts
const container = new HadesContainer({
  installers: [new SlashCommandsInstaller()],
});
```
