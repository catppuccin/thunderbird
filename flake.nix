{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
    catppuccin-toolbox.url = "github:catppuccin/toolbox";
  };

  description = "Development shell flake";
  outputs = { self, nixpkgs, flake-utils, catppuccin-toolbox }: flake-utils.lib.eachDefaultSystem (system: {
    devShell = let 
      pkgs = nixpkgs.legacyPackages.${system};
    in 
      pkgs.mkShell {
        packages = with pkgs; [
          just
          deno
          catppuccin-toolbox.packages.${system}.whiskers
        ];
      };
  });
}