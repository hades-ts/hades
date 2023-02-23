{
  inputs,
  cell,
}: let
  inherit (inputs) self dream2nix std;
  d2n = dream2nix.lib.makeFlakeOutputs {
    systems = [inputs.nixpkgs.system];
    config.projectRoot = std.incl self ["libs"];
    source = std.incl self ["libs"];
    projects = {
      ai = {
        name = "ai";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      bypass = {
        name = "bypass";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      generator = {
        name = "generator";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      guilds = {
        name = "guilds";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      hades = {
        name = "hades";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      lojban = {
        name = "lojban";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      slash-commands = {
        name = "slash-commands";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      stash = {
        name = "stash";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      tags = {
        name = "tags";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
      text-commands = {
        name = "text-commands";
        subsystem = "nodejs";
        subsystemInfo.nodejs = 18;
        translator = "package-json";
      };
    };
  };
in
  d2n.packages.${inputs.nixpkgs.system}
