import { describe, expect, test } from "bun:test"
import {
  buildThemeCss,
  darkTheme,
  fadedCommentOpacity,
  getThemeSelection,
  resolveTheme,
  themeList,
  themeOptions,
} from "@/utils/theme"

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map(i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

const TEXT_COLORS = ["text", "link", "linkHover", "subtext", "domainText", "commentLink"] as const
const SURFACES = ["background", "tableBg", "commentBg"] as const

describe("theme palettes", () => {
  for (const theme of themeList) {
    test(`${theme.id} text colors meet WCAG AA`, () => {
      const failures = TEXT_COLORS.flatMap(text =>
        SURFACES.filter(surface => contrast(theme.colors[text], theme.colors[surface]) < 4.5).map(
          surface => `${text} on ${surface}`,
        ),
      )
      expect(failures).toEqual([])
    })

    test(`${theme.id} header text meets WCAG AA`, () => {
      expect(contrast(theme.colors.accentText, theme.colors.headerBg)).toBeGreaterThanOrEqual(4.5)
    })
  }
})

describe("theme selection", () => {
  test("falls back to the default theme for unknown values", () => {
    expect(getThemeSelection("neon")).toBe("dark")
    expect(getThemeSelection(null)).toBe("dark")
    expect(getThemeSelection("off")).toBe("off")
  })

  test("system follows the color scheme and off resolves to nothing", () => {
    expect(resolveTheme("system", true)?.id).toBe("dark")
    expect(resolveTheme("system", false)?.id).toBe("light")
    expect(resolveTheme("off", true)).toBeNull()
    expect(resolveTheme("nord", false)?.id).toBe("nord")
  })

  test("the picker lists system, every palette and off", () => {
    expect(themeOptions.map(option => option.id)).toEqual(["system", ...themeList.map(t => t.id), "off"])
  })
})

describe("downvoted comments", () => {
  test("fade more the lighter HN would make them", () => {
    expect(fadedCommentOpacity("c5a")).toBeGreaterThan(fadedCommentOpacity("cdd"))
    expect(fadedCommentOpacity("cdd")).toBeGreaterThan(0.2)
  })

  test("keep their fading in the theme CSS", () => {
    const css = buildThemeCss(darkTheme)
    expect(css).toContain(".commtext.c5a { opacity: 0.72; }")
    expect(css).toContain(".commtext.cdd")
  })
})
