# Agent notes

- This is a Web Extension whose goal is to enhance the UI of Hacker News (`https://news.ycombinator.com/`).
- It is built with [WXT](https://wxt.dev/), targets Manifest V3 and is written in TypeScript with Solid.js for the
  popup and options pages.
- WXT docs for LLMs: https://wxt.dev/knowledge/docs.txt and https://wxt.dev/knowledge/api-reference.txt
- For Hacker News selectors read `selectors.md`; it explains the page structure and which selectors are stable.

## Conventions

- Use the `browser` global, never `chrome` (e.g. `browser.runtime.getURL()`), except in test code that runs inside
  an extension page.
- Always import with the `@/` alias (project root).
- Format with Prettier using `.prettierrc.json` (`bun run format`).
- Use bun, not npm.
- There is no `manifest.json` in the source. WXT generates it from `wxt.config.ts`, the entrypoints and modules;
  the output lands in `.output/{target}/manifest.json` after `bun run build`.
- Entrypoints live in `entrypoints/`, shared UI in `components/`, page logic in `utils/`.
- Every user-facing string goes through `@wxt-dev/i18n`. Add new keys to **every** file in `locales/` and to the
  `messages` stub in `screenshots/harness/store-page.html`.

## Where things are

| Path                     | What                                                                |
| ------------------------ | ------------------------------------------------------------------- |
| `entrypoints/content.ts` | Runs at `document_start`; applies the theme, layout and shortcuts   |
| `utils/theme.ts`         | Palettes, `system`/`off` selections and the theme CSS               |
| `utils/layout.ts`        | Modern layout, text size and keyboard highlight CSS                 |
| `utils/preferences.ts`   | Layout/keyboard preferences and their defaults                      |
| `utils/storage.ts`       | Synced storage items (`sync:theme`, `sync:preferences`)             |
| `utils/comments.ts`      | Comment thread depth and OP markers                                 |
| `utils/keyboard.ts`      | j/k/o/c keyboard navigation                                         |
| `components/`            | Theme picker, preview and preference controls for the popup/options |

## Checks

Run these before committing:

```bash
bun run compile      # typecheck
bun run test         # unit tests (bun test)
bun run test:e2e     # builds, then loads the extension in Chromium against tests/e2e/fixtures
bun run format:check
```
