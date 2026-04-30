import { injectThemeStyles, darkTheme } from "../utils/theme"

export default defineContentScript({
  matches: ["*://news.ycombinator.com/*"],
  main() {
    injectThemeStyles(darkTheme)
  },
})
