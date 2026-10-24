import { render } from "solid-js/web"
import { i18n } from "#i18n"
import { KeyboardPreferences, LayoutPreferences } from "@/components/preferences-panel"
import { ThemeSwitcher } from "@/components/theme-switcher"
import "./style.css"

function Options() {
  return (
    <main class="options">
      <header class="options__header">
        <span class="options__logo">Y</span>
        <div>
          <h1 class="options__title">{i18n.t("extensionName")}</h1>
          <p class="options__subtitle">{i18n.t("extensionDescription")}</p>
        </div>
      </header>

      <section class="options__card">
        <h2 class="options__section-title">{i18n.t("themeSectionTitle")}</h2>
        <p class="options__section-description">{i18n.t("themeSectionDescription")}</p>
        <ThemeSwitcher columns={4} showPreview />
      </section>

      <section class="options__card">
        <h2 class="options__section-title">{i18n.t("layoutSectionTitle")}</h2>
        <LayoutPreferences />
      </section>

      <section class="options__card">
        <h2 class="options__section-title">{i18n.t("keyboardSectionTitle")}</h2>
        <KeyboardPreferences />
      </section>
    </main>
  )
}

const root = document.getElementById("app")

if (root) {
  render(() => <Options />, root)
}
