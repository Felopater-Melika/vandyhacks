{
  description = "Vandyhacks X project frontend";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils";

  };
  # nixConfig = {
  #   bash-prompt = ''\[\033[1;32m\][\[\e]0;\u@\h: \w\a\]dev-shell:\w]\$\[\033[0m\] '';
  # };
  #
  outputs = { self, nixpkgs, flake-utils }:
  let system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };
  in with pkgs; {
    devShells.x86_64-linux.default = mkShell {
      buildInputs = [
        nodejs_20
        nodePackages.pnpm
        prefetch-npm-deps
      ];
       src = [
         ./flake.nix
         ./flake.lock
       ];

    flake-utils.lib.eachDefaultSystem = (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = with pkgs; [
      openssl
          nodePackages.prisma
        ];
        shellHook = with pkgs; ''
   
          export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
          export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
          export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
          export PRISMA_INTROSPECTION_ENGINE_BINARY="${prisma-engines}/bin/introspection-engine"
          export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
        '';
      };
    });
  }
