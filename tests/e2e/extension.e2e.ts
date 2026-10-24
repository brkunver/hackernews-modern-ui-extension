/**
 * Loads the built Chrome extension (`bun run build`) into Chromium and runs it against
 * the saved Hacker News pages in `fixtures/`, served in place of the real site.
 *
 * Run with `bun run test:e2e`. Set `CHROME_PATH` to use a Chromium other than the one
 * Playwright installed.
 */
import { createHash } from "node:crypto"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { chromium, expect, test as base, type BrowserContext, type Page } from "@playwright/test"

/** The extension API, as seen from inside an extension page during `page.evaluate`. */
declare const chrome: { storage: { sync: { set(values: Record<string, unknown>): Promise<void> } } }

const EXTENSION = resolve(import.meta.dirname, "../../.output/chrome-mv3")
const FIXTURES = resolve(import.meta.dirname, "fixtures")
const HN = "https://news.ycombinator.com"

/** Chrome derives the id of an unpacked extension from the hash of its path. */
function extensionId(path: string): string {
  const hash = createHash("sha256").update(path).digest("hex").slice(0, 32)
  return [...hash].map(char => String.fromCharCode(97 + parseInt(char, 16))).join("")
}

const test = base.extend<{ context: BrowserContext; hn: (path: string) => Promise<Page> }>({
  context: async ({}, use) => {
    const profile = mkdtempSync(join(tmpdir(), "hn-modern-ui-e2e-"))
    const context = await chromium.launchPersistentContext(profile, {
      channel: "chromium",
      executablePath: process.env["CHROME_PATH"] || undefined,
      args: [`--disable-extensions-except=${EXTENSION}`, `--load-extension=${EXTENSION}`],
    })

    await context.route(`${HN}/**`, route => {
      const { pathname } = new URL(route.request().url())
      const fixture =
        pathname === "/item" ? "item.html" : pathname === "/" || pathname === "/news" ? "front.html" : null
      if (!fixture) return route.fulfill({ status: 404, body: "" })
      return route.fulfill({ contentType: "text/html", body: readFileSync(join(FIXTURES, fixture)) })
    })

    await use(context)
    await context.close()
    rmSync(profile, { recursive: true, force: true })
  },

  hn: async ({ context }, use) => {
    await use(async path => {
      const page = await context.newPage()
      await page.goto(`${HN}${path}`)
      await expect(page.locator("#hackernews-theme-styles")).toBeAttached()
      return page
    })
  },
})

/** Changes the extension's synced settings from its own options page. */
async function setStorage(context: BrowserContext, values: Record<string, unknown>) {
  const options = await context.newPage()
  await options.goto(`chrome-extension://${extensionId(EXTENSION)}/options.html`)
  await options.evaluate(values => chrome.storage.sync.set(values), values)
  await options.close()
}

const background = (page: Page, selector: string) =>
  page.locator(selector).evaluate(el => getComputedStyle(el).backgroundColor)

test("applies the default dark theme", async ({ hn }) => {
  const page = await hn("/")

  expect(await background(page, "body")).toBe("rgb(15, 15, 15)")
  expect(await background(page, 'td[bgcolor="#ff6600"]')).toBe("rgb(26, 26, 26)")
  // The header separators are themed too, not left black on the dark header.
  expect(await page.locator(".pagetop").evaluate(el => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)")
  // Usernames get their own color.
  expect(await page.locator(".hnuser").first().getAttribute("style")).toMatch(/color: (hsl|rgb)\(/)
  await expect(page.locator("a.hn-comment-link")).toHaveCount(2)
})

test("keeps downvoted comments faded and marks threads and the OP", async ({ hn }) => {
  const page = await hn("/item?id=1001")

  const opacity = await page.locator(".commtext.cae").evaluate(el => getComputedStyle(el).opacity)
  expect(Number(opacity)).toBeLessThan(1)

  await expect(page.locator(`tr[id="2001"]`)).not.toHaveAttribute("data-hnm-depth")
  await expect(page.locator(`tr[id="2002"]`)).toHaveAttribute("data-hnm-depth", "0")
  await expect(page.locator(`tr[id="2003"]`)).toHaveAttribute("data-hnm-depth", "1")

  await expect(page.locator("tr.comtr .hnuser.hnm-op")).toHaveText(["alice"])
})

test("moves between stories with j and k", async ({ hn }) => {
  const page = await hn("/")

  await page.keyboard.press("j")
  await expect(page.locator("tr.hnm-kb-active")).toHaveAttribute("id", "1001")
  await page.keyboard.press("j")
  await expect(page.locator("tr.hnm-kb-active")).toHaveAttribute("id", "1002")
  await page.keyboard.press("k")
  await expect(page.locator("tr.hnm-kb-active")).toHaveAttribute("id", "1001")

  await page.keyboard.press("c")
  await page.waitForURL(`${HN}/item?id=1001`)
})

test("ignores shortcuts while typing", async ({ hn }) => {
  const page = await hn("/")

  await page.locator('input[name="q"]').fill("")
  await page.locator('input[name="q"]').press("j")
  await expect(page.locator("tr.hnm-kb-active")).toHaveCount(0)
  await expect(page.locator('input[name="q"]')).toHaveValue("j")
})

test("follows theme and layout changes live", async ({ context, hn }) => {
  const page = await hn("/")
  const fontFamily = () =>
    page
      .locator(".titleline")
      .first()
      .evaluate(el => getComputedStyle(el).fontFamily)
  expect(await fontFamily()).toContain("system-ui")

  await setStorage(context, { theme: "solarized" })
  await expect.poll(() => background(page, "body")).toBe("rgb(253, 246, 227)")

  await setStorage(context, {
    preferences: { modernLayout: false, keyboardNav: true, density: "comfortable", fontScale: 100 },
  })
  await expect.poll(fontFamily).not.toContain("system-ui")

  await setStorage(context, { theme: "off" })
  await expect(page.locator("#hackernews-theme-styles")).not.toBeAttached()
  expect(await page.locator(".hnuser").first().getAttribute("style")).toBeFalsy()
})

test("paints the cached theme on the next page load", async ({ context, hn }) => {
  await setStorage(context, { theme: "nord" })
  const page = await hn("/")
  await expect.poll(() => background(page, "body")).toBe("rgb(46, 52, 64)")

  // The cache lets the style be in place before the page's own content is parsed.
  await page.reload({ waitUntil: "commit" })
  await expect(page.locator("#hackernews-theme-styles")).toBeAttached()
  expect(await page.evaluate(() => localStorage.getItem("hackernews-modern-ui:settings"))).toContain("nord")
})

test("the popup switches the theme", async ({ context, hn }) => {
  const page = await hn("/")
  const popup = await context.newPage()
  await popup.goto(`chrome-extension://${extensionId(EXTENSION)}/popup.html`)

  await popup.getByRole("button", { name: "Dracula" }).click()
  await expect(popup.getByRole("button", { name: "Dracula" })).toHaveAttribute("aria-pressed", "true")
  await expect.poll(() => background(page, "body")).toBe("rgb(33, 34, 44)")
})
