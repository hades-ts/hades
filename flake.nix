{
  description = "A DI Discord bot framework";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    std = {
      url = "github:divnix/std";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    dream2nix = {
      url = "github:nix-community/dream2nix";
      inputs.nixpkgs.follows = "nixpkgs";
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
        (installables "packages")
        (functions "operables")
        (containers "containers")
      ];
    }
    {
      devShells = std.harvest self ["_automation" "devshells"];
      packages = std.harvest self [["bots" "packages"] ["libs" "packages"]];
    };
}
