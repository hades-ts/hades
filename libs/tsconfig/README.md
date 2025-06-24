# @hades-ts/tsconfig

Shared TypeScript configurations for the Hades monorepo.

## Available Configurations

### Base Configuration (`base.json`)
The foundation configuration with settings common to all packages:
- Decorator support
- ESM module resolution
- Source maps enabled
- Node types included

### Bot Configurations

#### `bot.json`
Standard configuration for Discord bot packages:
- Extends base configuration
- Includes DOM and ES6 libs
- Sets up src/dist directory structure

#### `bot-strict.json`
Strict TypeScript configuration for bots (pythia, zeus):
- Extends bot.json
- Enables strict mode

#### `bot-jsx.json`
JSX-enabled configuration for bots with Discord component rendering (dyskonos):
- Extends bot.json
- Configures JSX with Discord component factories
- Includes TSX file support
- Adds ES5 to lib array

### Published Package Configuration (`published.json`)
For packages published to npm:
- Extends base configuration
- Enables declaration file generation
- Stricter compiler options
- ESM import extension rewriting

### Library Configurations

#### `library.json`
Standard configuration for internal library packages:
- Extends base configuration
- Declaration file generation
- Standard src/dist structure

#### `library-esm.json`
ESM-specific library configuration:
- Extends library.json
- Uses ES2022 module/target
- Node module resolution

## Usage

In your package's `tsconfig.json`:

```json
{
  "extends": "@hades-ts/tsconfig/bot-strict.json",
  "compilerOptions": {
    // Override or add specific options as needed
  }
}
```

## Migration Guide

### For Bot Packages
- `hades` bot → use `bot.json`
- `dyskonos` bot → use `bot-jsx.json`
- `pythia`, `zeus` bots → use `bot-strict.json`

### For Published Packages (pkgs/)
- Use `published.json`

### For Library Packages (libs/)
- CommonJS libraries → use `library.json`
- ESM libraries → use `library-esm.json` 