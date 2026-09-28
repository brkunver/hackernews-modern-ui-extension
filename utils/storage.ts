import { storage } from "#imports"
import { DEFAULT_THEME_ID, getTheme, type Theme, type ThemeId } from "@/utils/theme"

/**
 * The user's selected theme. Stored in `sync` storage because it is a tiny
 * preference that should follow the user across their browsers.
 */
export const themeStorage = storage.defineItem<ThemeId>("sync:theme", {
  fallback: DEFAULT_THEME_ID,
})

/** Reads the selected theme, ignoring stored ids of themes that no longer exist. */
export async function getStoredTheme(): Promise<Theme> {
  return getTheme(await themeStorage.getValue())
}
