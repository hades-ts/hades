{
  inputs,
  cell,
}: let
  inherit (inputs) self dream2nix std;
  d2n = dream2nix.lib.makeFlakeOutputs {
    systems = [inputs.nixpkgs.system];
    config.projectRoot = std.incl self ["libs"];
    source = std.incl self ["libs"];
    projects =
      inputs.cells._automation.utils.mkD2nProjects [
        "ai"
        "bypass"
        "generator"
        "guilds"
        "hades"
        "lojban"
        "slash-commands"
        "stash"
        "tags"
        "text-commands"
      ] {
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
  };
in
  d2n.packages.${inputs.nixpkgs.system}
