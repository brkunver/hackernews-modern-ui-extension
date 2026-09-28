import { colorizeCommentLinks, colorizeUsernames } from "@/utils/colorize"
import { getStoredTheme, themeStorage } from "@/utils/storage"
import { injectThemeStyles } from "@/utils/theme"

async function applyStoredTheme() {
  const { colors } = await getStoredTheme()

  injectThemeStyles(colors)
  colorizeUsernames(colors.usernameLightness)
}

export default defineContentScript({
  matches: ["*://news.ycombinator.com/*"],
  async main() {
    await applyStoredTheme()
    colorizeCommentLinks()

    // Re-apply the theme when the user picks another one from the popup/options page.
    themeStorage.watch(() => {
      void applyStoredTheme()
    })
  },
})
