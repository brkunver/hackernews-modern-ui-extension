import { For, Show, createMemo, createSignal, onMount } from "solid-js"
import { i18n } from "#i18n"
import { HnPreview } from "@/components/hn-preview"
import { getStoredTheme, themeStorage } from "@/utils/storage"
import { DEFAULT_THEME_ID, getTheme, themeList, type Theme, type ThemeId } from "@/utils/theme"
import "./theme-switcher.css"

export interface ThemeSwitcherProps {
  /** Number of columns used by the theme grid. */
  columns?: 2 | 3 | 4
  /** Render a live Hacker News preview of the selected theme below the grid. */
  showPreview?: boolean
}

export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const [selectedId, setSelectedId] = createSignal<ThemeId>(DEFAULT_THEME_ID)

  onMount(async () => {
    setSelectedId((await getStoredTheme()).id)

    // Keep every open surface in sync (popup and options page can both be open).
    themeStorage.watch(newThemeId => {
      setSelectedId(getTheme(newThemeId).id)
    })
  })

  const selected = createMemo(() => getTheme(selectedId()))

  async function select(theme: Theme) {
    setSelectedId(theme.id)
    await themeStorage.setValue(theme.id)
  }

  return (
    <section class="theme-switcher">
      <div class={`theme-grid theme-grid--cols-${props.columns ?? 2}`}>
        <For each={themeList}>
          {theme => (
            <button
              type="button"
              class="theme-card"
              classList={{ "is-selected": selectedId() === theme.id }}
              aria-pressed={selectedId() === theme.id}
              onClick={() => void select(theme)}
            >
              <span class="theme-card__preview" style={`background-color: ${theme.colors.background}`}>
                <span class="theme-card__bar" style={`background-color: ${theme.colors.headerBg}`} />
                <span class="theme-card__line" style={`background-color: ${theme.colors.link}`} />
                <span
                  class="theme-card__line theme-card__line--short"
                  style={`background-color: ${theme.colors.subtext}`}
                />
                <span class="theme-card__dot" style={`background-color: ${theme.colors.commentLink}`} />
              </span>
              <span class="theme-card__name">{i18n.t(theme.nameKey)}</span>
            </button>
          )}
        </For>
      </div>

      <Show when={props.showPreview}>
        <section class="theme-preview">
          <h2 class="theme-preview__title">{i18n.t("themePreviewTitle")}</h2>
          <HnPreview colors={selected().colors} />
        </section>
      </Show>
    </section>
  )
}
