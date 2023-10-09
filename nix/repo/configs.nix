{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs std;
  inherit (std.lib) dev cfg;
in {
  editorconfig = dev.mkNixago cfg.editorconfig {
    hook.mode = "copy";
    data = {
      root = true;

      "*" = {
        charset = "utf-8";
        end_of_line = "lf";
        indent_size = "unset";
        indent_style = "space";
        insert_final_newline = true;
        max_line_length = "unset";
        trim_trailing_whitespace = true;
      };

      "*.nix" = {
        indent_size = 2;
        max_line_length = "120";
      };

      "*.{ts,js,json}" = {
        indent_size = 4;
        max_line_length = "120";
      };

      "*.{diff,patch}" = {
        end_of_line = "unset";
        insert_final_newline = "unset";
        trim_trailing_whitespace = "unset";
      };

      "{LICENSES/**,LICENSE,*.lock,package-lock.json}" = {
        charset = "unset";
        end_of_line = "unset";
        indent_size = "unset";
        indent_style = "unset";
        insert_final_newline = "unset";
        trim_trailing_whitespace = "unset";
      };
    };
  };

  treefmt = dev.mkNixago cfg.treefmt {
    packages = with nixpkgs; [
      alejandra
      nodePackages.prettier
    ];
    data.formatter = {
      nix = {
        command = "alejandra";
        includes = ["*.nix"];
      };
      prettier = {
        command = "prettier";
        options = ["--write"];
        includes = [
          "*.ts"
          "*.mts"
          "*.cts"
          "*.tsx"
          "*.js"
          "*.cjs"
          "*.mjs"
          "*.jsx"
          "*.md"
          "*.json"
        ];
      };
    };
  };

  conform = dev.mkNixago cfg.conform {
    data = {
      inherit (inputs) cells;
      commit = {
        header = {length = 89;};
        conventional = {
          types = [
            "build"
            "chore"
            "ci"
            "docs"
            "feat"
            "fix"
            "perf"
            "refactor"
            "style"
            "test"
          ];
          scopes = [
          ];
        };
      };
    };
  };

  lefthook = dev.mkNixago cfg.lefthook {
    data = {
      commit-msg.commands = {
        conform = {
          # allow WIP, fixup!/squash! commits locally
          run = ''
            [[ "$(head -n 1 {1})" =~ ^WIP(:.*)?$|^wip(:.*)?$|fixup\!.*|squash\!.* ]] ||
            conform enforce --commit-msg-file {1}'';
          skip = ["merge" "rebase"];
        };
      };
      pre-commit.commands = {
        treefmt = {
          run = "treefmt --fail-on-change {staged_files}";
          skip = ["merge" "rebase"];
        };
      };
    };
  };
}
