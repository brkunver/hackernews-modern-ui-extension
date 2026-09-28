export type ThemeId = "dark" | "light" | "nord" | "dracula" | "gruvbox" | "solarized"

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
  /** Text color used on top of `headerBg` (buttons, header labels). */
  accentText: string
  /** Lightness (0-100) used for the auto-generated username colors. */
  usernameLightness: number
  colorScheme: ThemeColorScheme
}

export interface Theme {
  id: ThemeId
  nameKey: ThemeNameKey
  colors: ThemeColors
}

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
  domainText: "#6d6d6d",
  commentLink: "#22d3ee",
  accentText: "#ffffff",
  usernameLightness: 70,
  colorScheme: "dark",
}

export const lightTheme: ThemeColors = {
  background: "#f6f6ef",
  text: "#000000",
  link: "#000000",
  linkHover: "#ff6600",
  border: "#ff6600",
  tableBg: "#f6f6ef",
  headerBg: "#ff6600",
  subtext: "#828282",
  commentBg: "#f6f6ef",
  domainText: "#666666",
  commentLink: "#0891b2",
  accentText: "#ffffff",
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
  subtext: "#7b88a1",
  commentBg: "#343b49",
  domainText: "#8a94ad",
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
  subtext: "#8591c2",
  commentBg: "#2b2d3a",
  domainText: "#6272a4",
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
  domainText: "#928374",
  commentLink: "#b8bb26",
  accentText: "#fbf1c7",
  usernameLightness: 72,
  colorScheme: "dark",
}

export const solarizedTheme: ThemeColors = {
  background: "#fdf6e3",
  text: "#586e75",
  link: "#268bd2",
  linkHover: "#d33682",
  border: "#eee8d5",
  tableBg: "#fdf6e3",
  headerBg: "#eee8d5",
  subtext: "#6f8080",
  commentBg: "#f9f3e0",
  domainText: "#7d8b8b",
  commentLink: "#1f7a75",
  accentText: "#586e75",
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

/** The theme used when the user has not picked one yet. */
export const DEFAULT_THEME_ID: ThemeId = "dark"

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && Object.hasOwn(themes, value)
}

/** Resolves a stored (possibly unknown) theme id, falling back to the default theme. */
export function getTheme(id?: string | null): Theme {
  return isThemeId(id) ? themes[id] : themes[DEFAULT_THEME_ID]
}

export function injectThemeStyles(theme: ThemeColors) {
  const style = document.createElement("style")
  style.id = "hackernews-theme-styles"
  style.textContent = `
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

    .titleline a {
      color: ${theme.link} !important;
    }

    .sitebit, .sitebit a {
      color: ${theme.domainText} !important;
    }

    .subtext {
      color: ${theme.subtext} !important;
    }

    .subtext a {
      color: ${theme.subtext} !important;
    }

    .subtext a.hnuser {
      color: ${theme.text} !important;
    }

    .subtext a.hn-comment-link {
      color: ${theme.commentLink} !important;
      font-weight: 500;
    }

    .commtext {
      color: ${theme.text} !important;
    }

    .comment {
      background-color: ${theme.commentBg} !important;
    }

    .comhead {
      color: ${theme.subtext} !important;
    }

    .hnuser {
      color: ${theme.link} !important;
    }

    .age a {
      color: ${theme.subtext} !important;
    }

    .togg {
      color: ${theme.link} !important;
    }

    textarea {
      background-color: ${theme.commentBg} !important;
      color: ${theme.text} !important;
      border-color: ${theme.border} !important;
    }

    input[type="submit"] {
      background-color: ${theme.headerBg} !important;
      color: ${theme.accentText} !important;
      border: none !important;
    }
  `

  // Remove existing styles if any
  const existing = document.getElementById("hackernews-theme-styles")
  if (existing) {
    existing.remove()
  }

  document.head.appendChild(style)
}

export function removeThemeStyles() {
  const existing = document.getElementById("hackernews-theme-styles")
  if (existing) {
    existing.remove()
  }
}
