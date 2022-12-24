{
  description = "A DI Discord bot framework";

  inputs.devshell = {
    url = "github:numtide/devshell";
    inputs = {
      nixpkgs.follows = "nixpkgs";
      flake-utils.follows = "flake-utils";
    };
  };

  # For rush, pending merge
  inputs.rush-nixpkgs.url = "github:Lord-Valen/nixpkgs/init/nodePackages.rush";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    devshell,
    rush-nixpkgs,
  }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShells.default = let
        shellPath = builtins.path {
          path = ./shell;
          name = "shellPath";
        };
        pkgs = import nixpkgs {
          inherit system;
          overlays = [devshell.overlay];
        };
        rushPkgs = rush-nixpkgs.legacyPackages.${system};
      in
        pkgs.devshell.mkShell {
          imports = [
            (pkgs.devshell.extraModulesDir + "/git/hooks.nix")
            (pkgs.devshell.importTOML (shellPath + "/devshell.toml"))
          ];

          commands = [
            {
              category = "monorepo";
              package = rushPkgs.nodePackages.rush;
            }
          ];

          git.hooks = {
            enable = true;
            pre-commit.text = builtins.readFile (shellPath + "/pre-commit.sh");
          };
        };
    });
}
