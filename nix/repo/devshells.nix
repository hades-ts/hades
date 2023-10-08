{
  inputs,
  cell,
}: let
  inherit (inputs) std nixpkgs;
  inherit (std.lib) dev;
  inherit (nixpkgs) lib;

  inherit (cell) configs;
in {
  default = dev.mkShell {
    name = "Hades";

    nixago = with configs; [
      editorconfig
      treefmt
      conform
      lefthook
    ];

    packages = with nixpkgs; [
      nodejs
      nodePackages.pnpm
      nodePackages.rush
    ];

    commands = let
      rush = attrset: {category = "rush";} // attrset;
    in
      builtins.map (command: rush command) [
        {
          name = "bld";
          command = ''rush build "$@"'';
          help = "Build projects incrementally.";
        }
        {
          name = "instl";
          command = ''rush install "$@"'';
          help = "Install project dependencies.";
        }
        {
          name = "rbld";
          command = ''upd --purge && rush rebuild'';
          help = "Purge and update; Rebuild all projects.";
        }
        {
          name = "upd";
          command = ''rush update "$@"'';
          help = "Update dependencies.";
        }
      ];
  };
}
