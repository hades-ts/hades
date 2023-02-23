{
  inputs,
  cell,
}: let
  inherit (inputs) self dream2nix std;
  d2n = dream2nix.lib.makeFlakeOutputs {
    systems = [inputs.nixpkgs.system];
    config.projectRoot = std.incl self ["bots"];
    source = std.incl self ["bots"];
    projects = {
      apollo = {
        name = "apollo";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      chaos = {
        name = "chaos";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      hades-bot = {
        name = "hades-bot";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      hypnos = {
        name = "hypnos";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      pythia = {
        name = "pythia";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      zeus = {
        name = "zeus";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
    };
  };
in
  d2n.packages.${inputs.nixpkgs.system}
