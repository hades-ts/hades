{ inputs, ... }:
{
  imports = [
    inputs.devenv.flakeModule
  ];

  flake-file = {
    nixConfig = {
      extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
      extra-substituters = "https://devenv.cachix.org";
    };
    inputs = {
      devenv-root = {
        url = "file+file:///dev/null";
        flake = false;
      };
      devenv.url = "github:cachix/devenv";
      nix2container.url = "github:nlewo/nix2container";
      nix2container.inputs.nixpkgs.follows = "nixpkgs";
      mk-shell-bin.url = "github:rrbutani/nix-mk-shell-bin";
    };
  };

  perSystem =
    {
      pkgs,
      config,
      self',
      ...
    }:
    {
      devenv.shells.default = {
        # See full reference at https://devenv.sh/reference/options/
        packages = [
          pkgs.git
          pkgs.turbo
          config.treefmt.build.wrapper
          self'.packages.write-flake
        ];

        languages = {
          javascript = {
            enable = true;
            pnpm.enable = true;
          };
          typescript.enable = true;
          nix = {
            enable = true;
            lsp.package = pkgs.nixd;
          };
        };

        tasks."copy:treefmt" = {
          exec = ''
            FILE="$DEVENV_ROOT"/treefmt.toml
            echo "### THIS FILE IS AUTO-GENERATED. SEE 'nix/devenv.nix' ###" > "$FILE"
            cat ${config.treefmt.build.configFile} >> "$FILE"
          '';
          before = [ "devenv:enterShell" ];
        };
      };
    };
}
