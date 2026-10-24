export type Density = "comfortable" | "compact"

export const FONT_SCALES = [90, 100, 110, 125] as const
export type FontScale = (typeof FONT_SCALES)[number]

export interface Preferences {
  /** Modern typography and spacing, comment thread lines and the OP badge. */
  modernLayout: boolean
  /** Spacing used by the modern layout. */
  density: Density
  /** Text size of the page, in percent. */
  fontScale: FontScale
  /** j/k/o/c keyboard navigation. */
  keyboardNav: boolean
}

export const DEFAULT_PREFERENCES: Preferences = {
  modernLayout: true,
  density: "comfortable",
  fontScale: 100,
  keyboardNav: true,
}

/**
 * Fills in missing or invalid fields with their defaults, so preferences stored by an
 * older version (or edited by hand) never break the content script.
 */
export function normalizePreferences(value: unknown): Preferences {
  const stored = (typeof value === "object" && value !== null ? value : {}) as Partial<
    Record<keyof Preferences, unknown>
  >

  return {
    modernLayout: typeof stored.modernLayout === "boolean" ? stored.modernLayout : DEFAULT_PREFERENCES.modernLayout,
    density:
      stored.density === "compact" || stored.density === "comfortable" ? stored.density : DEFAULT_PREFERENCES.density,
    fontScale: FONT_SCALES.includes(stored.fontScale as FontScale)
      ? (stored.fontScale as FontScale)
      : DEFAULT_PREFERENCES.fontScale,
    keyboardNav: typeof stored.keyboardNav === "boolean" ? stored.keyboardNav : DEFAULT_PREFERENCES.keyboardNav,
  }
}
