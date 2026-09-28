# Chrome Web Store screenshots

Every image is **1280x800** (the size the Chrome Web Store asks for), and the store listing takes
them in this order:

| File                          | Shows                                                                  |
| ----------------------------- | ---------------------------------------------------------------------- |
| `01-popup.png`                | The toolbar popup with the theme picker, all six palettes              |
| `02-options.png`              | The options page: theme grid and the live Hacker News preview          |
| `03-hacker-news-dark.png`     | The Hacker News front page with the default dark theme applied         |
| `04-hacker-news-solarized.png`| An item page with comments using the Solarized (light) theme           |

## Regenerating

```bash
bun run screenshots
```

The script builds the extension, then renders the pages in headless Chrome:

- `harness/store-popup.html` and `harness/store-options.html` are the 1280x800 compositions. They
  iframe `harness/store-page.html`, which stubs the extension APIs so the **real built** popup and
  options pages can be rendered outside of an extension context. The extension UI is pinned to its
  dark scheme in `store-page.html` so shots do not depend on the color scheme of the machine taking
  them.
- The two Hacker News shots are live snapshots of `news.ycombinator.com` taken during the run, with
  the built content script injected, so they show exactly what the extension does to the real site.

Chrome is located automatically; set `CHROME_PATH` if it is somewhere unusual.
