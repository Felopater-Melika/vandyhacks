{
  description = "Vandyhacks X project frontend";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils";
    poetry2nix.url = "github:nix-community/poetry2nix";
    poetry2nix.inputs.nixpkgs.follows = "nixpkgs";

  };
  # nixConfig = {
  #   bash-prompt = ''\[\033[1;32m\][\[\e]0;\u@\h: \w\a\]dev-shell:\w]\$\[\033[0m\] '';
  # };
  #
  outputs = { self, nixpkgs, flake-utils, poetry2nix }:
    flake-utils.lib.eachDefaultSystem (system: let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
        config.permittedInsecurePackages = [
          "openssl-1.1.1v"
          "openssl-1.1.1w"
        ];
        overlay = [ poetry2nix.overlay ];
      };
    in {
      devShells.default = (pkgs.buildFHSUserEnv {
        name="env";
        targetPkgs = p: with p; [
          # openssl
          sqlite
          google-cloud-sdk
          ngrok
          python311
          p.poetry
          openssl_1_1
          alsa-lib
          libuuid
        ];
        /*src = [
          ./flake.nix
          ./flake.lock
        ];*/
        profile = "source .venv/bin/activate";

        /* profile = with pkgs; ''
          export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
          export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
          export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
          export PRISMA_INTROSPECTION_ENGINE_BINARY="${prisma-engines}/bin/introspection-engine"
          export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
        ''; */
      }).env;
    });
}
