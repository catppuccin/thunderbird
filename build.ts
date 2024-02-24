#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env
import { variants } from "npm:@catppuccin/palette@0.1.5";
import { titleCase } from "https://deno.land/x/case@2.2.0/mod.ts";
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";

const accents = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
] as const;

const start = performance.now();
let count = 0;

await Promise.all(
  Object.entries(variants).map(async ([name, palette]) => {
    for (const accent of accents) {
      const newTheme = {
        manifest_version: 2,
        name: `catppuccin-${name}-${accent}`,
        version: "1.0.0",
        applications: {
          gecko: {
            // FIXME: Make properly
            id: `theme@catppuccinorg.com`,
            strict_min_version: "60.0",
          },
        },
        description: `Catppuccin theme for Thunderbird - ${titleCase(
          name
        )} ${titleCase(accent)}`,
        // TODO:
        // icons: {
        //   "16": "images/icon16.png",
        //   "48": "images/icon48.png",
        //   "128": "images/icon128.png",
        // },
        theme_experiment: {
          colors: {
            spaces_bg: "--spaces-bg-color",
            tree_view_bg: "--tree-view-bg",
            bg_color: "--bg-color",
          },
        },
        theme: {
          colors: {
            frame: palette.base.hex,
            button_background_active: palette[accent].hex,
            button_background_hover: palette.surface0.hex,
            icons: palette.text.hex,
            tab_text: palette.text.hex,
            tab_line: palette[accent].hex,
            tab_loading: palette[accent].hex,
            tab_selected: palette.base.hex,
            tab_background_text: palette.overlay1.hex,
            tab_background_separator: palette.surface0.hex,
            bookmark_text: palette.text.hex,
            toolbar: palette.base.hex,
            toolbar_field: palette.surface0.hex,
            toolbar_field_text: palette.text.hex,
            toolbar_field_highlight: palette[accent].hex,
            toolbar_field_highlight_text: palette.mantle.hex,
            toolbar_field_border: palette.mantle.hex,
            toolbar_field_focus: palette.surface0.hex,
            toolbar_field_text_focus: palette.text.hex,
            toolbar_field_border_focus: palette[accent].hex,
            toolbar_top_separator: palette.surface0.hex,
            toolbar_bottom_separator: palette.surface0.hex,
            toolbar_vertical_separator: palette.surface0.hex,
            sidebar: palette.base.hex,
            sidebar_text: palette.text.hex,
            sidebar_highlight: palette[accent].hex,
            sidebar_highlight_text: palette.mantle.hex,
            sidebar_border: palette.surface0.hex,
            popup: palette.surface0.hex,
            popup_text: palette.text.hex,
            popup_border: palette.base.hex,
            popup_highlight: palette[accent].hex,
            popup_highlight_text: palette.mantle.hex,
            spaces_bg: palette.mantle.hex,
            tree_view_bg: palette.mantle.hex,
            bg_color: palette.base.hex,
          },
        },
      };

      Deno.mkdirSync(`./themes/${name}/${name}-${accent}`, {
        recursive: true,
      });

      Deno.mkdirSync(`./zips/${name}`, {
        recursive: true,
      });

      Deno.writeTextFileSync(
        `./themes/${name}/${name}-${accent}/manifest.json`,
        JSON.stringify(newTheme, undefined, 2)
      );

      const zip = new JSZip();
      zip.addFile("manifest.json", JSON.stringify(newTheme, undefined, 2));

      await zip.writeZip(`./zips/${name}/${name}-${accent}.xpi`);

      count += 1;
    }
  })
);

console.log("Built", count, "files in", performance.now() - start, "ms");
