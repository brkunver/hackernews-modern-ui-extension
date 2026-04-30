import { injectThemeStyles, darkTheme } from "../utils/theme"
import { colorizeUsernames } from "../utils/colorize"

export default defineContentScript({
  matches: ["*://news.ycombinator.com/*"],
  main() {
    injectThemeStyles(darkTheme)
    colorizeUsernames()
  },
})
