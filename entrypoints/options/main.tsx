import { render } from "solid-js/web"
import { i18n } from "#i18n"
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
        <ThemeSwitcher columns={3} showPreview />
      </section>
    </main>
  )
}

const root = document.getElementById("app")

if (root) {
  render(() => <Options />, root)
}
