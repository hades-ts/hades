{
  inputs,
  cell,
}: let
  inherit (inputs) std nixpkgs;
  lib = nixpkgs.lib // builtins;
in
  lib.mapAttrs (_: std.lib.dev.mkShell)
  {
    default = {...}: {
      name = "hades-dev";
      packages = [
        nixpkgs.nodejs
        nixpkgs.nodePackages.pnpm
      ];
      commands = [
        {
          category = "rush";
          package = nixpkgs.nodePackages.rush;
        }
        {
          category = "rush";
          name = "bld";
          command = ''rush build "$@"'';
          help = "Build projects incrementally.";
        }
        {
          category = "rush";
          name = "upd";
          command = ''rush update "$@"'';
          help = "Update dependencies.";
        }
        {
          category = "rush";
          name = "rbld";
          command = ''upd --purge && rush rebuild'';
          help = "Purge and update. Rebuild all projects.";
        }
      ];
      nixago = [
        cell.configs.editorconfig
        cell.configs.treefmt
        cell.configs.lefthook
      ];
    };
  }
