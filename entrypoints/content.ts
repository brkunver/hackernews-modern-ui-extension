import { colorizeCommentLinks, colorizeUsernames, uncolorizeUsernames } from "@/utils/colorize"
import { markCommentDepths, markOriginalPoster } from "@/utils/comments"
import { clearKeyboardSelection, installKeyboardNav } from "@/utils/keyboard"
import { buildKeyboardCss, buildLayoutCss, buildScaleCss } from "@/utils/layout"
import { normalizePreferences, type Preferences } from "@/utils/preferences"
import { getStoredPreferences, getStoredThemeSelection, preferencesStorage, themeStorage } from "@/utils/storage"
import { buildThemeCss, getThemeSelection, resolveTheme, type Theme, type ThemeSelection } from "@/utils/theme"

const STYLE_ID = "hackernews-theme-styles"

/**
 * The last applied settings, cached in the page's own localStorage. Extension storage
 * is async, so without this the page would paint in its original colors before the
 * theme arrives.
 */
const CACHE_KEY = "hackernews-modern-ui:settings"

interface Settings {
  selection: ThemeSelection
  preferences: Preferences
}

const darkScheme = window.matchMedia("(prefers-color-scheme: dark)")

let settings: Settings | null = null
let domReady = false

function readCache(): Settings | null {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null")
    if (!cached) return null
    return { selection: getThemeSelection(cached.selection), preferences: normalizePreferences(cached.preferences) }
  } catch {
    return null
  }
}

function writeCache(value: Settings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value))
  } catch {
    // Storage can be blocked (e.g. third-party cookie settings); the cache is optional.
  }
}

function activeTheme(): Theme | null {
  return settings ? resolveTheme(settings.selection, darkScheme.matches) : null
}

function setStyles(css: string | null) {
  document.getElementById(STYLE_ID)?.remove()
  if (css === null) return

  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = css
  // At document_start <head> does not exist yet, so append to the root element.
  ;(document.head ?? document.documentElement).appendChild(style)
}

/** Styles depend only on the settings, so they are applied before the page is parsed. */
function applyStyles() {
  const theme = activeTheme()
  if (!settings || !theme) {
    setStyles(null)
    return
  }

  const { preferences } = settings
  setStyles(
    [
      buildThemeCss(theme.colors),
      preferences.modernLayout ? buildLayoutCss(preferences, theme.colors) : "",
      buildScaleCss(preferences),
      preferences.keyboardNav ? buildKeyboardCss(theme.colors) : "",
    ].join("\n"),
  )
}

/** Changes that need the page's DOM. */
function applyDom() {
  if (!domReady) return

  const theme = activeTheme()
  if (!theme) {
    uncolorizeUsernames()
    clearKeyboardSelection()
    return
  }

  colorizeUsernames(theme.colors.usernameLightness)
  if (!settings?.preferences.keyboardNav) clearKeyboardSelection()
}

function apply() {
  applyStyles()
  applyDom()
}

function update(value: Settings) {
  settings = value
  writeCache(value)
  apply()
}

async function loadSettings(): Promise<Settings> {
  const [selection, preferences] = await Promise.all([getStoredThemeSelection(), getStoredPreferences()])
  return { selection, preferences }
}

function onDomReady() {
  domReady = true
  colorizeCommentLinks()
  markCommentDepths()
  markOriginalPoster()
  applyDom()
}

export default defineContentScript({
  matches: ["*://news.ycombinator.com/*"],
  runAt: "document_start",
  async main() {
    // Paint with the cached settings right away, then correct them from storage.
    settings = readCache()
    applyStyles()

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onDomReady, { once: true })
    } else {
      onDomReady()
    }

    installKeyboardNav(() => Boolean(settings?.preferences.keyboardNav && activeTheme()))
    darkScheme.addEventListener("change", apply)

    update(await loadSettings())

    // Re-apply when the user changes a setting from the popup/options page.
    themeStorage.watch(selection => {
      if (settings) update({ ...settings, selection: getThemeSelection(selection) })
    })
    preferencesStorage.watch(preferences => {
      if (settings) update({ ...settings, preferences: normalizePreferences(preferences) })
    })
  },
})
