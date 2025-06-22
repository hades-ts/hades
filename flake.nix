{
  description = "A DI Discord bot framework";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    devshell.url = "github:numtide/devshell";
    nixago.url = "github:nix-community/nixago";
    std = {
      url = "github:divnix/std";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        devshell.follows = "devshell";
        nixago.follows = "nixago";
      };
    };
  };

  outputs = {
    std,
    self,
    ...
  } @ inputs:
    std.growOn {
      inherit inputs;
      cellsFrom = ./nix;
      cellBlocks = with std.blockTypes; [
        (devshells "devshells")
        (nixago "configs")
        (functions "utils")
        (installables "packages")
        (functions "operables")
        (containers "containers")
      ];
    }
    {
      devShells = std.harvest self ["repo" "devshells"];
    };
}
