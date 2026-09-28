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

Display names are translated through `@wxt-dev/i18n`. Only `locales/en.yml` ships the theme
strings, and other locales fall back to English for those keys.
