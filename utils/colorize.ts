export function colorizeUsernames(lightness = 70) {
  const users = document.querySelectorAll<HTMLElement>(".hnuser")

  users.forEach(user => {
    const username = user.textContent
    if (!username) return

    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }

    const h = Math.abs(hash) % 360
    // HSL with constrained saturation and lightness so it stays readable on the active theme
    user.style.setProperty("color", `hsl(${h}, 65%, ${lightness}%)`, "important")
  })
}

export function colorizeCommentLinks() {
  const links = document.querySelectorAll<HTMLAnchorElement>(".subtext a")

  links.forEach(link => {
    const text = link.textContent?.trim() || ""
    if (text.includes("comment") || text === "discuss") {
      link.classList.add("hn-comment-link")
    }
  })
}
