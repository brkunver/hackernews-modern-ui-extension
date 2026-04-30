export function colorizeUsernames() {
  const users = document.querySelectorAll<HTMLElement>(".hnuser")

  users.forEach(user => {
    const username = user.textContent
    if (!username) return

    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }

    const h = Math.abs(hash) % 360
    // HSL with constrained saturation and lightness for dark backgrounds
    user.style.setProperty("color", `hsl(${h}, 65%, 70%)`, "important")
  })
}
