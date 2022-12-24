# Configuration

To enable Text Commands, add the `TextCommandsInstaller` to your `HadesContainer`:

```ts
const container = new HadesContainer({
    installers: [
        new TextCommandsInstaller(),
    ],
})
```