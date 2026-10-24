import { describe, expect, test } from "bun:test"
import { buildLayoutCss, buildScaleCss } from "@/utils/layout"
import { DEFAULT_PREFERENCES, normalizePreferences } from "@/utils/preferences"
import { darkTheme } from "@/utils/theme"

describe("normalizePreferences", () => {
  test("returns the defaults for missing or broken values", () => {
    expect(normalizePreferences(undefined)).toEqual(DEFAULT_PREFERENCES)
    expect(normalizePreferences("nope")).toEqual(DEFAULT_PREFERENCES)
    expect(normalizePreferences({ density: "huge", fontScale: 300, keyboardNav: "yes" })).toEqual(DEFAULT_PREFERENCES)
  })

  test("keeps valid values and fills in the rest", () => {
    expect(normalizePreferences({ density: "compact", fontScale: 125 })).toEqual({
      ...DEFAULT_PREFERENCES,
      density: "compact",
      fontScale: 125,
    })
  })
})

describe("layout css", () => {
  test("density changes the spacing", () => {
    const comfortable = buildLayoutCss({ ...DEFAULT_PREFERENCES, density: "comfortable" }, darkTheme)
    const compact = buildLayoutCss({ ...DEFAULT_PREFERENCES, density: "compact" }, darkTheme)
    expect(comfortable).toContain("height: 10px !important")
    expect(compact).toContain("height: 4px !important")
  })

  test("text size only emits css when it differs from 100%", () => {
    expect(buildScaleCss(DEFAULT_PREFERENCES)).toBe("")
    expect(buildScaleCss({ ...DEFAULT_PREFERENCES, fontScale: 110 })).toContain("zoom: 1.1")
  })
})
