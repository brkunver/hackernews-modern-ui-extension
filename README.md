# Hacker News Modern UI Extension

This is a Web Extension that enhances the Hacker News UI with a modern, clean, and fast design.

## Themes

The theme can be changed from the toolbar popup or the extension's options page, and it is applied
to every open Hacker News tab right away. The built-in themes are:

| Theme          | Scheme |
| -------------- | ------ |
| Dark (default) | dark   |
| Light          | light  |
| Nord           | dark   |
| Dracula        | dark   |
| Gruvbox        | dark   |
| Solarized      | light  |

Theme definitions live in `utils/theme.ts`; the selection is stored with WXT storage
(`sync:theme`) so it follows the user between browsers.

Display names are translated through `@wxt-dev/i18n`. Every bundled locale ships the theme strings,
so no locale falls back to English for the theme picker.

## Screenshots

The Chrome Web Store images live in `screenshots/` (1280x800 each). Regenerate them with
`bun run screenshots`; see `screenshots/README.md` for what each one shows.
