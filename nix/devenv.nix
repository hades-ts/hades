{ inputs, ... }:
{
  imports = [
    inputs.devenv.flakeModule
    inputs.files.flakeModules.default
    inputs.treefmt-nix.flakeModule
  ];

  perSystem =
    {
      pkgs,
      config,
      ...
    }:
    {
      devenv.shells.default = {
        # See full reference at https://devenv.sh/reference/options/
        packages = [
          pkgs.git
          pkgs.turbo
          config.treefmt.build.wrapper
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

      treefmt.programs = {
        biome.enable = true;
        nixfmt.enable = true;
      };
    };
}
