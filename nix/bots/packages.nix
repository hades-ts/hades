{
  inputs,
  cell,
}: let
  inherit (inputs) self dream2nix std;
  d2n = dream2nix.lib.makeFlakeOutputs {
    systems = [inputs.nixpkgs.system];
    config.projectRoot = std.incl self ["bots"];
    source = std.incl self ["bots"];
    projects =
      inputs.cells._automation.utils.mkD2nProjects [
        "apollo"
        "chaos"
        "hades-bot"
        "hypnos"
        "pythia"
        "zeus"
      ] {
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
  };
in
  d2n.packages.${inputs.nixpkgs.system}
