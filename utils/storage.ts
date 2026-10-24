import { storage } from "#imports"
import { DEFAULT_PREFERENCES, normalizePreferences, type Preferences } from "@/utils/preferences"
import { DEFAULT_THEME_ID, getThemeSelection, type ThemeSelection } from "@/utils/theme"

/**
 * The user's selected theme. Stored in `sync` storage because it is a tiny
 * preference that should follow the user across their browsers.
 */
export const themeStorage = storage.defineItem<ThemeSelection>("sync:theme", {
  fallback: DEFAULT_THEME_ID,
})

/** Layout and keyboard preferences, synced like the theme. */
export const preferencesStorage = storage.defineItem<Preferences>("sync:preferences", {
  fallback: DEFAULT_PREFERENCES,
})

/** Reads the selected theme, ignoring stored ids of themes that no longer exist. */
export async function getStoredThemeSelection(): Promise<ThemeSelection> {
  return getThemeSelection(await themeStorage.getValue())
}

export async function getStoredPreferences(): Promise<Preferences> {
  return normalizePreferences(await preferencesStorage.getValue())
}

/** Merges a change into the stored preferences. */
export async function updatePreferences(change: Partial<Preferences>): Promise<Preferences> {
  const next = { ...(await getStoredPreferences()), ...change }
  await preferencesStorage.setValue(next)
  return next
}
