{
  description = "A DI Discord bot framework";

  inputs.devshell = {
    url = "github:numtide/devshell";
    inputs = {
      nixpkgs.follows = "nixpkgs";
      flake-utils.follows = "flake-utils";
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    devshell,
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
      in
        pkgs.devshell.mkShell {
          imports = [
            (pkgs.devshell.extraModulesDir + "/git/hooks.nix")
            (pkgs.devshell.importTOML (shellPath + "/devshell.toml"))
          ];
          git.hooks = {
            enable = true;
            pre-commit.text = builtins.readFile (shellPath + "/pre-commit.sh");
          };
        };
    });
}
