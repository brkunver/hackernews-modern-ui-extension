import { THREAD_HUES } from "@/utils/layout"

/**
 * Tags every reply with `data-hnm-depth` so the layout CSS can draw a colored thread
 * line for it. Top-level comments get no line.
 */
export function markCommentDepths() {
  document.querySelectorAll<HTMLTableRowElement>("tr.comtr").forEach(row => {
    const indent = Number(row.querySelector("td.ind")?.getAttribute("indent") ?? 0)

    if (indent > 0) {
      row.dataset["hnmDepth"] = String((indent - 1) % THREAD_HUES.length)
    } else {
      delete row.dataset["hnmDepth"]
    }
  })
}

/** Marks the story author's usernames in the comments of an item page. */
export function markOriginalPoster() {
  const author = document.querySelector(".fatitem .subtext .hnuser, .fatitem .subline .hnuser")?.textContent?.trim()
  if (!author) return

  document.querySelectorAll<HTMLElement>("tr.comtr .hnuser").forEach(user => {
    user.classList.toggle("hnm-op", user.textContent?.trim() === author)
  })
}
