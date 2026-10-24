const ACTIVE_CLASS = "hnm-kb-active"

/**
 * Items the keyboard moves between: the visible comments on an item page, the stories
 * everywhere else.
 */
function navigableRows(): HTMLTableRowElement[] {
  const comments = [...document.querySelectorAll<HTMLTableRowElement>("tr.athing.comtr")]
  if (comments.length > 0) return comments.filter(row => !row.classList.contains("noshow"))

  return [...document.querySelectorAll<HTMLTableRowElement>("tr.athing:not(.comtr)")].filter(
    row => !row.closest(".fatitem"),
  )
}

function activeRow(): HTMLTableRowElement | null {
  return document.querySelector<HTMLTableRowElement>(`tr.${ACTIVE_CLASS}`)
}

function activate(row: HTMLTableRowElement | undefined) {
  if (!row) return

  activeRow()?.classList.remove(ACTIVE_CLASS)
  row.classList.add(ACTIVE_CLASS)
  row.scrollIntoView({ block: "nearest" })
}

function move(step: 1 | -1) {
  const rows = navigableRows()
  const current = activeRow()
  const index = current ? rows.indexOf(current) : -1

  // Nothing selected yet (or the selection was collapsed away): start at the edge.
  if (index === -1) {
    activate(step === 1 ? rows[0] : rows[rows.length - 1])
    return
  }

  activate(rows[Math.min(Math.max(index + step, 0), rows.length - 1)])
}

/** `o`: opens the story, or collapses/expands the comment. */
function open(newTab: boolean) {
  const row = activeRow()
  if (!row) return

  if (row.classList.contains("comtr")) {
    row.querySelector<HTMLElement>("a.togg")?.click()
    return
  }

  const link = row.querySelector<HTMLAnchorElement>(".titleline > a")
  if (link) navigate(link.href, newTab)
}

/** `c`: opens the comments of the selected story. */
function openComments(newTab: boolean) {
  const row = activeRow()
  if (!row || row.classList.contains("comtr")) return

  // The age and the comment count both link to the item page; the comment count comes last.
  const links = row.nextElementSibling?.querySelectorAll<HTMLAnchorElement>(`.subtext a[href^="item?id="]`)
  const link = links?.[links.length - 1]
  if (link) navigate(link.href, newTab)
}

function navigate(url: string, newTab: boolean) {
  if (newTab) {
    window.open(url, "_blank", "noopener")
  } else {
    location.href = url
  }
}

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

/**
 * Installs the j/k/o/c shortcuts. `isEnabled` is checked on every key press, so the
 * shortcuts follow the user's settings without reinstalling the listener.
 */
export function installKeyboardNav(isEnabled: () => boolean) {
  document.addEventListener("keydown", event => {
    if (!isEnabled() || event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return

    switch (event.key.toLowerCase()) {
      case "j":
        move(1)
        break
      case "k":
        move(-1)
        break
      case "o":
      case "enter":
        // Enter keeps its normal meaning (following a focused link) unless an item is selected.
        if (event.key === "Enter" && (!activeRow() || document.activeElement !== document.body)) return
        open(event.shiftKey)
        break
      case "c":
        openComments(event.shiftKey)
        break
      case "escape":
        activeRow()?.classList.remove(ACTIVE_CLASS)
        break
      default:
        return
    }

    event.preventDefault()
  })
}

/** Drops the keyboard selection (used when the shortcuts get turned off). */
export function clearKeyboardSelection() {
  activeRow()?.classList.remove(ACTIVE_CLASS)
}
