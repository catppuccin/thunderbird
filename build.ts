#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env
import {
  AccentName,
  CatppuccinFlavor,
  flavorEntries,
  flavors,
} from "jsr:@catppuccin/palette@1.7.1";
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";
import * as uuid from "jsr:@std/uuid@1.0.7";

// Allows for the UUIDs to be "seeded" and therefore reproducible
// DO NOT CHANGE
const NAMESPACE_URL = "6da2d448-69ec-48e0-aabf-3c6379788110";

type ThemeObject = {
  manifest_version: number;
  name: string;
  version: string;
  applications: {
    gecko: {
      id: string;
      strict_min_version: string;
    };
  };
  description: string;
  icons: Record<string, string>;
  theme_experiment: {
    stylesheet: string;
    colors: Record<string, string>;
  };
  theme: {
    colors: Record<string, string>;
    properties: {
      color_scheme: string;
    };
  };
  dark_theme: {
    colors: Record<string, string>;
    properties: {
      color_scheme: string;
    };
  };
};

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

async function makeThemeObject(
  identifier: string,
  accent: AccentName,
  flavor: CatppuccinFlavor,
  autoTheme: boolean,
): Promise<ThemeObject> {
  const darkColors = getColors(accent, flavor);
  let lightColors = getColors(accent, flavor);
  let colorScheme = "dark";

  if (!flavor.dark) {
    colorScheme = "light";
  }

  if (autoTheme) {
    lightColors = getColors(accent, flavors.latte);
    colorScheme = "auto";
  }

  const themeName = `catppuccin-${identifier}-${accent}`;
  const encodedName = new TextEncoder().encode(themeName);
  return {
    manifest_version: 2,
    name: themeName,
    version: "1.0.0",
    applications: {
      gecko: {
        id: `{${await uuid.v5.generate(NAMESPACE_URL, encodedName)}}`,
        strict_min_version: "60.0",
      },
    },
    description: `Soothing pastel theme for Thunderbird - ${flavor.name} ${
      flavor.colors[accent].name
    }`,
    icons: {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png",
    },
    theme_experiment: {
      stylesheet: "styles.css",
      colors: {
        spaces_bg: "--spaces-bg-color",
        spaces_bg_active: "--spaces-button-active-bg-color",
        spaces_button: "--spaces-button-active-text-color",
        tree_view_bg: "--tree-view-bg",
        bg_color: "--bg-color",
        button_primary_bg: "--button-primary-background-color",
        button_text: "--button-primary-text-color",
        tree_pane_bg: "--tree-pane-background",
        tree_card_bg: "--tree-card-background",
        layout_bg_0: "--layout-background-0",
        layout_bg_1: "--layout-background-1",
        button_bg: "--button-background-color",
        lwt_accent_color: "--lwt-accent-color",
        list_container_background_selected_current:
          "--list-container-background-selected-current",
        ab_cards_list_bg: "--ab-cards-list-bg",
        in_content_box_info_background: "--in-content-box-info-background",
        calendar_view_toggle_bg: "--calendar-view-toggle-background",
        calendar_view_toggle_hover_bg:
          "--calendar-view-toggle-hover-background",
        tabs_toolbar_bg: "--tabs-toolbar-background-color",
        color_gray_70: "--color-gray-70",
        color_gray_50: "--color-gray-50",
      },
    },
    theme: {
      colors: lightColors,
      properties: {
        color_scheme: colorScheme,
      },
    },
    dark_theme: {
      colors: darkColors,
      properties: {
        color_scheme: colorScheme,
      },
    },
  };
}

function getColors(
  accent: AccentName,
  flavor: CatppuccinFlavor,
): Record<string, string> {
  return {
    frame: flavor.colors.base.hex,
    button_background_active: flavor.colors[accent].hex,
    button_background_hover: flavor.colors.surface0.hex,
    icons: flavor.colors.text.hex,
    tab_text: flavor.colors.text.hex,
    tab_line: flavor.colors[accent].hex,
    tab_loading: flavor.colors[accent].hex,
    tab_selected: flavor.colors.base.hex,
    tab_background_text: flavor.colors.overlay1.hex,
    tab_background_separator: flavor.colors.surface0.hex,
    bookmark_text: flavor.colors.text.hex,
    toolbar: flavor.colors.base.hex,
    toolbar_field: flavor.colors.surface0.hex,
    toolbar_field_text: flavor.colors.text.hex,
    toolbar_field_highlight: flavor.colors[accent].hex,
    toolbar_field_highlight_text: flavor.colors.mantle.hex,
    toolbar_field_border: flavor.colors.mantle.hex,
    toolbar_field_focus: flavor.colors.surface0.hex,
    toolbar_field_text_focus: flavor.colors.text.hex,
    toolbar_field_border_focus: flavor.colors[accent].hex,
    toolbar_top_separator: flavor.colors.surface0.hex,
    toolbar_bottom_separator: flavor.colors.surface0.hex,
    toolbar_vertical_separator: flavor.colors.surface0.hex,
    sidebar: flavor.colors.base.hex,
    sidebar_text: flavor.colors.text.hex,
    sidebar_highlight: flavor.colors[accent].hex,
    sidebar_highlight_text: flavor.colors.mantle.hex,
    sidebar_border: flavor.colors.surface0.hex,
    popup: flavor.colors.surface0.hex,
    popup_text: flavor.colors.text.hex,
    popup_border: flavor.colors.base.hex,
    popup_highlight: flavor.colors[accent].hex,
    popup_highlight_text: flavor.colors.mantle.hex,
    spaces_bg: flavor.colors.mantle.hex,
    tree_view_bg: flavor.colors.crust.hex,
    bg_color: flavor.colors.base.hex,
    spaces_bg_active: flavor.colors[accent].hex,
    button_primary_bg: flavor.colors[accent].hex,
    button_text: flavor.colors.crust.hex,
    spaces_button: flavor.colors.crust.hex,
    tree_pane_bg: flavor.colors.crust.hex,
    tree_card_bg: flavor.colors.mantle.hex,
    layout_bg_0: flavor.colors.base.hex,
    layout_bg_1: flavor.colors.base.hex,
    button_bg: flavor.colors.mantle.hex,
    lwt_accent_color: flavor.colors.mantle.hex,
    list_container_background_selected_current: flavor.colors.mantle.hex,
    ab_cards_list_bg: flavor.colors.mantle.hex,
    in_content_box_info_background: flavor.colors.mantle.hex,
    calendar_view_toggle_bg: flavor.colors.mantle.hex,
    calendar_view_toggle_hover_bg: flavor.colors.surface0.hex,
    tabs_toolbar_bg: flavor.colors.mantle.hex,
    color_gray_70: flavor.colors.mantle.hex,
    color_gray_50: flavor.colors.surface1.hex,
  };
}

async function generateVariants(
  identifier: string,
  flavor: CatppuccinFlavor,
) {
  for (const accent of accents) {
    const fileName = `${identifier}-${accent}.xpi`;
    const theme = await makeThemeObject(identifier, accent, flavor, false);
    writeTheme(fileName, theme, `./themes/default/${identifier}`);
    if (flavor != flavors.latte) {
      const autoTheme = await makeThemeObject(identifier, accent, flavor, true);
      writeTheme(fileName, autoTheme, `./themes/auto/${identifier}`);
    }
  }
}

async function writeTheme(
  fileName: string,
  theme: ThemeObject,
  path: string,
) {
  const json = JSON.stringify(theme, undefined, 2);

  Deno.mkdirSync(`${path}`, {
    recursive: true,
  });

  const zip = new JSZip();
  zip.addFile("manifest.json", json);

  const images = zip.folder("images");
  images.addFile("icon16.png", "./assets/icon16.png");
  images.addFile("icon48.png", "./assets/icon48.png");
  images.addFile("icon128.png", "./assets/icon128.png");

  await zip.writeZip(`${path}/${fileName}`);
}

const start = performance.now();
await Promise.all(
  flavorEntries.map(([identifier, flavor]) =>
    generateVariants(identifier, flavor)
  ),
);

console.log("Built in", performance.now() - start, "ms");
