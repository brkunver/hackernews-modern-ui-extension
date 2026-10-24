export type ThemeId = "dark" | "light" | "nord" | "dracula" | "gruvbox" | "solarized"

/**
 * What the user can pick: a concrete palette, `system` (light or dark following the
 * OS/browser preference) or `off` (leave Hacker News untouched).
 */
export type ThemeSelection = ThemeId | "system" | "off"

/** Which native browser UI (scrollbars, form controls, ...) suits the theme. */
export type ThemeColorScheme = "light" | "dark"

/** i18n keys used to look up a theme's display name in `locales/*.yml`. */
export type ThemeNameKey =
  | "themeDark"
  | "themeLight"
  | "themeNord"
  | "themeDracula"
  | "themeGruvbox"
  | "themeSolarized"
  | "themeSystem"
  | "themeOff"

export interface ThemeColors {
  background: string
  text: string
  link: string
  linkHover: string
  border: string
  tableBg: string
  headerBg: string
  subtext: string
  commentBg: string
  domainText: string
  commentLink: string
  /** Text color used on top of `headerBg` (header nav, buttons). */
  accentText: string
  /** Lightness (0-100) used for the auto-generated username and thread colors. */
  usernameLightness: number
  colorScheme: ThemeColorScheme
}

export interface Theme {
  id: ThemeId
  nameKey: ThemeNameKey
  colors: ThemeColors
}

// Every text color below keeps a WCAG AA contrast ratio (4.5:1) against `background`,
// `tableBg` and `commentBg`; `tests/unit/theme.test.ts` enforces it.

export const darkTheme: ThemeColors = {
  background: "#0f0f0f",
  text: "#e6e6e6",
  link: "#e6e6e6",
  linkHover: "#ffb86c",
  border: "#2b2b2b",
  tableBg: "#121212",
  headerBg: "#1a1a1a",
  subtext: "#9a9a9a",
  commentBg: "#181818",
  domainText: "#848484",
  commentLink: "#22d3ee",
  accentText: "#ffffff",
  usernameLightness: 70,
  colorScheme: "dark",
}

export const lightTheme: ThemeColors = {
  background: "#f6f6ef",
  text: "#000000",
  link: "#000000",
  linkHover: "#b94a00",
  border: "#ff6600",
  tableBg: "#f6f6ef",
  headerBg: "#ff6600",
  subtext: "#6d6d6d",
  commentBg: "#f6f6ef",
  domainText: "#666666",
  commentLink: "#087994",
  accentText: "#000000",
  usernameLightness: 35,
  colorScheme: "light",
}

export const nordTheme: ThemeColors = {
  background: "#2e3440",
  text: "#d8dee9",
  link: "#88c0d0",
  linkHover: "#8fbcbb",
  border: "#4c566a",
  tableBg: "#2e3440",
  headerBg: "#3b4252",
  subtext: "#9ca9b9",
  commentBg: "#343b49",
  domainText: "#a0aabd",
  commentLink: "#a3be8c",
  accentText: "#eceff4",
  usernameLightness: 72,
  colorScheme: "dark",
}

export const draculaTheme: ThemeColors = {
  background: "#21222c",
  text: "#f8f8f2",
  link: "#8be9fd",
  linkHover: "#ff79c6",
  border: "#44475a",
  tableBg: "#282a36",
  headerBg: "#44475a",
  subtext: "#8b97c6",
  commentBg: "#2b2d3a",
  domainText: "#8696bc",
  commentLink: "#50fa7b",
  accentText: "#f8f8f2",
  usernameLightness: 75,
  colorScheme: "dark",
}

export const gruvboxTheme: ThemeColors = {
  background: "#1d2021",
  text: "#ebdbb2",
  link: "#83a598",
  linkHover: "#fabd2f",
  border: "#3c3836",
  tableBg: "#282828",
  headerBg: "#3c3836",
  subtext: "#a89984",
  commentBg: "#32302f",
  domainText: "#a2998c",
  commentLink: "#b8bb26",
  accentText: "#fbf1c7",
  usernameLightness: 72,
  colorScheme: "dark",
}

export const solarizedTheme: ThemeColors = {
  background: "#fdf6e3",
  text: "#586e75",
  link: "#1d70ae",
  linkHover: "#c52b76",
  border: "#eee8d5",
  tableBg: "#fdf6e3",
  headerBg: "#eee8d5",
  subtext: "#636e6e",
  commentBg: "#f9f3e0",
  domainText: "#676f6f",
  commentLink: "#1f7a75",
  accentText: "#4a5d63",
  usernameLightness: 38,
  colorScheme: "light",
}

export const themes: Record<ThemeId, Theme> = {
  dark: { id: "dark", nameKey: "themeDark", colors: darkTheme },
  light: { id: "light", nameKey: "themeLight", colors: lightTheme },
  nord: { id: "nord", nameKey: "themeNord", colors: nordTheme },
  dracula: { id: "dracula", nameKey: "themeDracula", colors: draculaTheme },
  gruvbox: { id: "gruvbox", nameKey: "themeGruvbox", colors: gruvboxTheme },
  solarized: { id: "solarized", nameKey: "themeSolarized", colors: solarizedTheme },
}

/** Themes in the order they are shown to the user. */
export const themeList: Theme[] = Object.values(themes)

/** Hacker News' own colors, used to preview the `off` selection. */
export const originalColors: ThemeColors = {
  ...lightTheme,
  linkHover: "#000000",
  subtext: "#828282",
  domainText: "#828282",
  commentLink: "#828282",
}

/** An entry of the theme picker: either a palette or one of the special selections. */
export interface ThemeOption {
  id: ThemeSelection
  nameKey: ThemeNameKey
  /** Colors drawn on the picker card. `system` shows its light and dark halves. */
  swatches: [ThemeColors] | [ThemeColors, ThemeColors]
}

export const themeOptions: ThemeOption[] = [
  { id: "system", nameKey: "themeSystem", swatches: [lightTheme, darkTheme] },
  ...themeList.map((theme): ThemeOption => ({ id: theme.id, nameKey: theme.nameKey, swatches: [theme.colors] })),
  { id: "off", nameKey: "themeOff", swatches: [originalColors] },
]

/** The selection used when the user has not picked one yet. */
export const DEFAULT_THEME_ID: ThemeId = "dark"

/** The palettes `system` switches between. */
export const SYSTEM_THEMES: Record<ThemeColorScheme, ThemeId> = { light: "light", dark: "dark" }

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && Object.hasOwn(themes, value)
}

export function isThemeSelection(value: unknown): value is ThemeSelection {
  return value === "system" || value === "off" || isThemeId(value)
}

/** Normalizes a stored (possibly unknown) selection, falling back to the default theme. */
export function getThemeSelection(value?: string | null): ThemeSelection {
  return isThemeSelection(value) ? value : DEFAULT_THEME_ID
}

/** Resolves a stored (possibly unknown) theme id, falling back to the default theme. */
export function getTheme(id?: string | null): Theme {
  return isThemeId(id) ? themes[id] : themes[DEFAULT_THEME_ID]
}

/**
 * Turns a selection into the palette to apply, or `null` when the extension should
 * leave the page alone.
 */
export function resolveTheme(selection: ThemeSelection, prefersDark: boolean): Theme | null {
  if (selection === "off") return null
  if (selection === "system") return themes[SYSTEM_THEMES[prefersDark ? "dark" : "light"]]
  return themes[selection]
}

/** HN fades downvoted comments with these classes (`c5a` = #5a5a5a, ...). */
const FADED_COMMENT_CLASSES = ["c5a", "c73", "c82", "c88", "c9c", "cae", "cbe", "cce", "cdd"]

/**
 * Opacity that reproduces HN's fading on any background: the class name is the gray
 * level HN would use on its own cream background.
 */
export function fadedCommentOpacity(className: string): number {
  const level = parseInt(className.slice(1), 16)
  return Math.round((1 - (level / 255) * 0.8) * 100) / 100
}

export function buildThemeCss(theme: ThemeColors): string {
  const fadedComments = FADED_COMMENT_CLASSES.map(
    className => `.commtext.${className} { opacity: ${fadedCommentOpacity(className)}; }`,
  ).join("\n    ")

  return `
    :root {
      color-scheme: ${theme.colorScheme} !important;
    }

    body {
      background-color: ${theme.background} !important;
      color: ${theme.text} !important;
    }

    #hnmain {
      background-color: ${theme.tableBg} !important;
    }

    td[bgcolor="#ff6600"] {
      background-color: ${theme.headerBg} !important;
    }

    a {
      color: ${theme.link} !important;
    }

    a:hover {
      color: ${theme.linkHover} !important;
    }

    .pagetop,
    .pagetop a,
    .pagetop font {
      color: ${theme.accentText} !important;
    }

    .titleline a {
      color: ${theme.link} !important;
    }

    .sitebit, .sitebit a {
      color: ${theme.domainText} !important;
    }

    .subtext, .subline {
      color: ${theme.subtext} !important;
    }

    .subtext a {
      color: ${theme.subtext} !important;
    }

    .subtext a.hn-comment-link {
      color: ${theme.commentLink} !important;
      font-weight: 500;
    }

    .commtext {
      color: ${theme.text} !important;
    }

    ${fadedComments}

    .comment {
      background-color: ${theme.commentBg} !important;
    }

    .comhead {
      color: ${theme.subtext} !important;
    }

    /* Fallback until the usernames get their own colors (see utils/colorize.ts). */
    .hnuser {
      color: ${theme.link} !important;
    }

    .age a {
      color: ${theme.subtext} !important;
    }

    .togg {
      color: ${theme.link} !important;
    }

    font[color="#828282"], .rank, .yclinks {
      color: ${theme.subtext} !important;
    }

    ${theme.colorScheme === "dark" ? ".votearrow { filter: brightness(1.8); }" : ""}

    textarea,
    select,
    input:not([type]),
    input[type="text"],
    input[type="password"],
    input[type="url"],
    input[type="email"],
    input[type="number"],
    input[type="search"] {
      background-color: ${theme.commentBg} !important;
      color: ${theme.text} !important;
      border: 1px solid ${theme.border} !important;
    }

    input[type="submit"] {
      background-color: ${theme.headerBg} !important;
      color: ${theme.accentText} !important;
      border: none !important;
    }

    pre {
      background-color: color-mix(in srgb, ${theme.text} 8%, transparent) !important;
    }

    pre, code {
      color: ${theme.text} !important;
    }
  `
}
