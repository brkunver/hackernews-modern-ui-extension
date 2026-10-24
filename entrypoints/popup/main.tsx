import { render } from "solid-js/web"
import { browser } from "#imports"
import { i18n } from "#i18n"
import { SwitchRow, usePreferences } from "@/components/preferences-panel"
import { ThemeSwitcher } from "@/components/theme-switcher"
import "./style.css"

function Popup() {
  const [preferences, updatePreferences] = usePreferences()

  return (
    <main class="popup">
      <header class="popup__header">
        <span class="popup__logo">Y</span>
        <div>
          <h1 class="popup__title">{i18n.t("extensionName")}</h1>
          <p class="popup__subtitle">{i18n.t("themeSectionDescription")}</p>
        </div>
      </header>

      <h2 class="popup__section">{i18n.t("themeSectionTitle")}</h2>
      <ThemeSwitcher columns={3} />

      <div class="popup__toggle">
        <SwitchRow
          label={i18n.t("modernLayout")}
          checked={preferences().modernLayout}
          onChange={modernLayout => void updatePreferences({ modernLayout })}
        />
      </div>

      <footer class="popup__footer">
        <button type="button" class="popup__options" onClick={() => void browser.runtime.openOptionsPage()}>
          {i18n.t("openOptionsPage")}
        </button>
      </footer>
    </main>
  )
}

const root = document.getElementById("app")

if (root) {
  render(() => <Popup />, root)
}
