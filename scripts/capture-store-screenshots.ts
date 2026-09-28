/**
 * Regenerates the Chrome Web Store screenshots in `screenshots/`.
 *
 * The extension pages (popup, options) are captured through `screenshots/harness`,
 * which stubs the extension APIs so the real built pages can be rendered in a plain
 * browser. The Hacker News screenshots are taken from live snapshots of the site with
 * the extension's own built content script applied to them.
 *
 * Usage: `bun run screenshots`
 */
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { dirname, extname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const OUTPUT = join(ROOT, ".output", "chrome-mv3")
const SCREENSHOTS = join(ROOT, "screenshots")
const HARNESS = join(SCREENSHOTS, "harness")
const PORT = 4519
const WIDTH = 1280
const HEIGHT = 800
const HN = "https://news.ycombinator.com"
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"

const HARNESS_FILES = ["store.css", "store-page.html", "store-popup.html", "store-options.html"]
const GENERATED_FILES = ["_store-hn.css", "_store-hn-front.html", "_store-hn-item.html"]
const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function findChrome(): string {
  const candidates = [
    process.env["CHROME_PATH"],
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean) as string[]

  const found = candidates.find(candidate => existsSync(candidate))
  if (!found) {
    throw new Error(`No Chrome binary found. Set CHROME_PATH to one of:\n  ${candidates.join("\n  ")}`)
  }
  return found
}

function run(command: string, args: string[], cwd?: string): Promise<{ code: number; stderr: string }> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "ignore", "pipe"] })
    let stderr = ""

    child.stderr.on("data", chunk => (stderr += String(chunk)))
    child.on("error", reject)
    child.on("close", code => resolvePromise({ code: code ?? 1, stderr }))
  })
}

/** Points relative assets in hn.css at the live site, since the snapshot is served locally. */
function absolutizeCss(css: string): string {
  return css.replace(/url\((['"]?)(?!https?:|\/\/|data:)([^)'"]+)\1\)/g, `url($1${HN}/$2$1)`)
}

function absolutizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/src="(?!https?:|\/\/|data:)([^"]+)"/g, `src="${HN}/$1"`)
    .replace(/href="(?!https?:|\/\/|data:|#)([^"]+)"/g, `href="${HN}/$1"`)
}

/** The extension APIs the content script reads, faked for the snapshot. */
function storageStub(theme: string): string {
  const noop = "() => {}"
  return `<script>
    globalThis.chrome = {
      i18n: { getMessage: () => "" },
      storage: {
        sync: {
          get: async () => ({ theme: ${JSON.stringify(theme)}, "theme$": {} }),
          set: async () => {},
          remove: async () => {},
          onChanged: { addListener: ${noop}, removeListener: ${noop} },
        },
        onChanged: { addListener: ${noop}, removeListener: ${noop} },
      },
      runtime: { id: "screenshot" },
    }
  </script>`
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return await res.text()
}

/** Writes a local copy of a live Hacker News page with the real content script applied. */
async function writeHnSnapshot(name: string, path: string, theme: string) {
  const html = await fetchText(`${HN}${path}`)
  const cssTag = html.match(/<link[^>]*news\.css[^>]*>/)?.[0]
  if (!cssTag) throw new Error(`Could not find the news.css link on ${path}`)

  const cssHref = cssTag.match(/href="([^"]+)"/)?.[1]
  if (cssHref) {
    await writeFile(join(OUTPUT, "_store-hn.css"), absolutizeCss(await fetchText(`${HN}/${cssHref}`)))
  }

  const snapshot = absolutizeHtml(html)
    .split(cssTag)
    .join('<link rel="stylesheet" href="/_store-hn.css">')
    .replace("</body>", `${storageStub(theme)}<script src="/content-scripts/content.js"></script></body>`)

  await writeFile(join(OUTPUT, name), snapshot)
}

function pngSize(buffer: Buffer): { width: number; height: number } {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

async function capture(chrome: string, profile: string, file: string, urlPath: string) {
  const target = join(SCREENSHOTS, file)
  await rm(target, { force: true })

  const { code } = await run(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--force-device-scale-factor=1",
    `--window-size=${WIDTH},${HEIGHT}`,
    `--user-data-dir=${profile}`,
    `--screenshot=${target}`,
    `http://localhost:${PORT}${urlPath}`,
  ])

  if (!existsSync(target)) {
    throw new Error(`Chrome (exit ${code}) did not write ${file}. Open ${urlPath} to debug.`)
  }

  const size = pngSize(await readFile(target))
  if (size.width !== WIDTH || size.height !== HEIGHT) {
    throw new Error(`${file} is ${size.width}x${size.height}, expected ${WIDTH}x${HEIGHT}`)
  }

  console.log(`  ${file}  (${size.width}x${size.height})`)
}

async function main() {
  const chrome = findChrome()

  console.log("Building the extension...")
  const build = await run("bun", ["run", "build"], ROOT)
  if (build.code !== 0) throw new Error(`Build failed:\n${build.stderr}`)

  await mkdir(SCREENSHOTS, { recursive: true })
  for (const file of HARNESS_FILES) {
    await copyFile(join(HARNESS, file), join(OUTPUT, file))
  }

  console.log("Snapshotting Hacker News...")
  const frontPage = await fetchText(`${HN}/`)
  const firstStory = frontPage.match(/href="item\?id=(\d+)"/)?.[1]
  if (!firstStory) throw new Error("Could not find a story id on the Hacker News front page")
  await writeHnSnapshot("_store-hn-front.html", "/", "dark")
  await writeHnSnapshot("_store-hn-item.html", `/item?id=${firstStory}`, "solarized")

  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url ?? "/", `http://localhost:${PORT}`).pathname

    if (pathname === "/slow.css") {
      // Holds the load event until the framed extension pages have mounted, so Chrome's
      // --screenshot never captures a half-rendered composition.
      await sleep(2500)
      response.writeHead(200, { "Content-Type": MIME_TYPES[".css"]! })
      response.end("/* hold */")
      return
    }

    const file = join(OUTPUT, pathname)
    try {
      const body = await readFile(file)
      response.writeHead(200, { "Content-Type": MIME_TYPES[extname(file)] ?? "application/octet-stream" })
      response.end(body)
    } catch {
      response.writeHead(404)
      response.end("Not found")
    }
  })

  await new Promise<void>(resolvePromise => server.listen(PORT, "127.0.0.1", resolvePromise))

  const profile = join(tmpdir(), `hn-modern-ui-screenshots-${Date.now()}`)
  const shots = [
    { file: "01-popup.png", path: "/store-popup.html" },
    { file: "02-options.png", path: "/store-options.html" },
    { file: "03-hacker-news-dark.png", path: "/_store-hn-front.html" },
    { file: "04-hacker-news-solarized.png", path: "/_store-hn-item.html" },
  ]

  try {
    console.log("Capturing screenshots...")
    for (const shot of shots) {
      await capture(chrome, profile, shot.file, shot.path)
    }
  } finally {
    server.closeAllConnections()
    await new Promise<void>(resolvePromise => server.close(() => resolvePromise()))
    await rm(profile, { recursive: true, force: true })
    for (const file of [...HARNESS_FILES, ...GENERATED_FILES]) {
      await rm(join(OUTPUT, file), { force: true })
    }
  }

  console.log(`Done. ${shots.length} screenshots written to screenshots/`)
}

await main()
