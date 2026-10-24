import type { Preferences } from "@/utils/preferences"
import type { ThemeColors } from "@/utils/theme"

/** Hues of the comment thread lines, cycled by nesting depth. */
export const THREAD_HUES = [205, 140, 40, 330, 265, 10]

const SANS = `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
const MONO = `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`

const SPACING = {
  comfortable: { spacer: 10, title: 15, subtext: 12.5, comment: 14.5, commentLineHeight: 1.6, commentGap: 14 },
  compact: { spacer: 4, title: 13.5, subtext: 11.5, comment: 13.5, commentLineHeight: 1.45, commentGap: 6 },
} as const

export function threadColor(depth: number, theme: ThemeColors): string {
  const hue = THREAD_HUES[depth % THREAD_HUES.length]
  return `hsl(${hue}, 55%, ${theme.usernameLightness}%)`
}

/** Text size. Applies with or without the modern layout. */
export function buildScaleCss(prefs: Preferences): string {
  return prefs.fontScale === 100 ? "" : `#hnmain { zoom: ${prefs.fontScale / 100}; }`
}

/** Highlight of the item selected with the keyboard (see utils/keyboard.ts). */
export function buildKeyboardCss(theme: ThemeColors): string {
  return `
    tr.hnm-kb-active > td {
      background-color: color-mix(in srgb, ${theme.commentLink} 12%, transparent) !important;
    }

    tr.hnm-kb-active > td:first-child {
      box-shadow: inset 3px 0 0 ${theme.commentLink};
    }

    tr.comtr.hnm-kb-active > td {
      background-color: transparent !important;
      box-shadow: none;
    }

    tr.comtr.hnm-kb-active td.default {
      background-color: color-mix(in srgb, ${theme.commentLink} 12%, transparent) !important;
      outline: 1px solid color-mix(in srgb, ${theme.commentLink} 45%, transparent);
      border-radius: 6px;
    }
  `
}

/** Modern typography, spacing and comment threads. */
export function buildLayoutCss(prefs: Preferences, theme: ThemeColors): string {
  const s = SPACING[prefs.density]
  const threadLines = THREAD_HUES.map(
    (_, depth) => `tr.comtr[data-hnm-depth="${depth}"] td.default { border-left-color: ${threadColor(depth, theme)}; }`,
  ).join("\n    ")

  return `
    body, td, .title, .subtext, .subline, .yclinks, .pagetop, .hnname, .comhead,
    .comment, .commtext, .default, .admin, input, textarea, select, button {
      font-family: ${SANS} !important;
    }

    pre, code, tt {
      font-family: ${MONO} !important;
    }

    @media (min-width: 751px) {
      #hnmain {
        width: min(1080px, calc(100% - 32px)) !important;
        margin: 16px auto !important;
        border: 1px solid ${theme.border};
        border-collapse: separate;
        border-radius: 12px;
        overflow: hidden;
      }
    }

    #hnmain > tbody > tr:first-child > td {
      padding: 6px 10px !important;
    }

    .pagetop {
      font-size: 13px !important;
      line-height: 1.6;
    }

    .hnname {
      margin-right: 6px;
    }

    .title {
      font-size: ${s.title}px !important;
    }

    .titleline {
      line-height: 1.35;
    }

    .titleline > a {
      font-weight: 500;
    }

    .rank {
      font-variant-numeric: tabular-nums;
    }

    .sitebit {
      font-size: ${s.subtext - 0.5}px !important;
    }

    .subtext, .subline {
      font-size: ${s.subtext}px !important;
      line-height: 1.5;
    }

    tr.spacer {
      height: ${s.spacer}px !important;
    }

    .comhead {
      font-size: ${s.subtext}px !important;
    }

    .commtext {
      font-size: ${s.comment}px !important;
      line-height: ${s.commentLineHeight} !important;
    }

    .commtext p {
      margin-top: 0.6em;
      margin-bottom: 0;
    }

    .comment {
      max-width: 80ch;
      padding-top: 2px;
    }

    tr.comtr > td {
      padding-bottom: ${s.commentGap}px;
    }

    tr.comtr td.default {
      padding-left: 10px;
      border-left: 2px solid transparent;
    }

    ${threadLines}

    a.togg {
      display: inline-block;
      min-width: 1.6em;
      margin-left: 4px;
      padding: 0 6px;
      border-radius: 4px;
      background-color: color-mix(in srgb, ${theme.text} 10%, transparent);
      text-align: center;
      text-decoration: none;
    }

    a.togg:hover {
      background-color: color-mix(in srgb, ${theme.text} 18%, transparent);
    }

    .hnuser.hnm-op::after {
      content: "OP";
      display: inline-block;
      margin-left: 5px;
      padding: 0 5px;
      border-radius: 4px;
      background-color: ${theme.commentLink};
      color: ${theme.tableBg};
      font-size: 0.8em;
      font-weight: 700;
      line-height: 1.5;
      vertical-align: 1px;
    }

    pre {
      padding: 10px 12px;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre;
    }
  `
}
