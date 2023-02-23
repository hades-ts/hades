{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs;
  lib = nixpkgs.lib // builtins;
in {
  mkD2nProjects = names: attrs: lib.genAttrs names (name: {name = name;} // attrs);
}
