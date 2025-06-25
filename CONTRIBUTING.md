# Tools

- [devenv](https://devenv.sh/)
- [pnpm](https://pnpm.io/)
- [turborepo](https://turborepo.com/)
- [biome](https://biomejs.dev/)

## Using devenv and the flake

- Usage of devenv is optional.
- Requires [Nix](https://nixos.org/) to be installed.
- [nix-direnv](https://github.com/nix-community/nix-direnv) is recommended.

Provides us with a consistent dev environment. The nix flake is responsible for generating
`/treefmt.toml` using devenv and [treefmt-nix](https://github.com/numtide/treefmt-nix).

### Entering the devenv

```
direnv allow
```

or

```
nix develop --override-input devenv-root "file+file://$PWD/.devenv/root"
```

### Nix Files

This repo observes the [dendritic pattern](https://github.com/mightyiam/dendritic) for easy extensibility.

- [flake.nix](flake.nix) is the entry point.
- Every file must be a [Nix flake](https://wiki.nixos.org/wiki/Flakes) or a [flake-parts
  module](https://flake.parts/module-arguments.html).
- Every file in a directory scanned by [import-tree](https://github.com/vic/import-tree) must be a
  flake-parts module.

Do not litter Nix files in the repository root.

## Turbo

- Task runner.

### Tasks

Turbo works by forming a Directed Acyclic Graph (DAG) of the scripts of all workspace packages.
Using the Task Graph DAG, it is able to run many scripts in parallel. You can read more about the
Task Graph [here](https://turborepo.com/docs/core-concepts/package-and-task-graph).

Most of the common package scripts can be run with turbo. You can see the definitions for all repo-wide tasks [here](turbo.json). Package specific tasks (or package specific properties of tasks) can be defined locally in a `turbo.json` file. The local file should [extend](https://turborepo.com/docs/reference/configuration#extends) the root file.

### Filtering

- [Upstream documentation](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters).

Most of the time you don't want to rebuild the world because you're working on just one package. Any
changes in dependencies need to be propagated up to the package you're working and, for testing
purposes, any changes in the package needs to be propagated up to its dependents. For these reason,
it's safest to make use of Turbo's task graph with filtering.

Turbo's filtering syntax is similar to pnpm filtering. Globs and paths can be matched, and are best
written wrapped in braces (e.g. `{./*}`). A trailing ellipsis matches the package and its
dependencies; a leading ellipsis matches the package and its dependents. These can be combined to
match a package's entire dependency tree.

#### Recipes

Build the full tree stemming from the package(s) in the current working directory. Omit the leading or trailing ellipsis to exclude dependents or dependencies respectively.

```
turbo run --filter ...{.}... build
```

### Bypassing the Cache

Turbo's caching can be bypassed using `turbo run --force`.

## Using `pnpm`

- Package manager.

[Recursive pnpm](https://pnpm.io/cli/recursive) and [filtering](https://pnpm.io/filtering) is your
friend.

### Installing Dependencies

```
pnpm i -r <package>
```

### Updating Dependencies

```
pnpm up -r
```

We maintain a [pnpm catalog](https://pnpm.io/catalogs) for dependencies which should be kept
consistent. Catalog items need to be updated manually until pnpm implements cli updates.
