{ inputs, ... }:
{
  imports = [ inputs.treefmt-nix.flakeModule ];
  flake-file = {
    inputs = {
      treefmt-nix.url = "github:numtide/treefmt-nix";
    };
  };
  perSystem.treefmt.programs = {
    biome.enable = true;
    nixfmt.enable = true;
  };
}
