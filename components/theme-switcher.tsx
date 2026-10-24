import { For, Show, createMemo, createSignal, onCleanup, onMount } from "solid-js"
import { i18n } from "#i18n"
import { HnPreview } from "@/components/hn-preview"
import { getStoredThemeSelection, themeStorage } from "@/utils/storage"
import {
  DEFAULT_THEME_ID,
  getThemeSelection,
  originalColors,
  resolveTheme,
  themeOptions,
  type ThemeColors,
  type ThemeOption,
  type ThemeSelection,
} from "@/utils/theme"
import "./theme-switcher.css"

export interface ThemeSwitcherProps {
  /** Number of columns used by the theme grid. */
  columns?: 2 | 3 | 4
  /** Render a live Hacker News preview of the selected theme below the grid. */
  showPreview?: boolean
}

/** A miniature page in a theme's colors. The "System" card shows two side by side. */
function ThemeCardPreview(props: { colors: ThemeColors }) {
  return (
    <span class="theme-card__preview" style={`background-color: ${props.colors.background}`}>
      <span class="theme-card__bar" style={`background-color: ${props.colors.headerBg}`} />
      <span class="theme-card__line" style={`background-color: ${props.colors.link}`} />
      <span class="theme-card__line theme-card__line--short" style={`background-color: ${props.colors.subtext}`} />
      <span class="theme-card__dot" style={`background-color: ${props.colors.commentLink}`} />
    </span>
  )
}

export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const [selectedId, setSelectedId] = createSignal<ThemeSelection>(DEFAULT_THEME_ID)
  const darkScheme = window.matchMedia("(prefers-color-scheme: dark)")
  const [prefersDark, setPrefersDark] = createSignal(darkScheme.matches)
  const onSchemeChange = () => setPrefersDark(darkScheme.matches)

  onMount(() => {
    darkScheme.addEventListener("change", onSchemeChange)
    void getStoredThemeSelection().then(setSelectedId)

    // Keep every open surface in sync (popup and options page can both be open).
    const unwatch = themeStorage.watch(newSelection => {
      setSelectedId(getThemeSelection(newSelection))
    })

    onCleanup(() => {
      unwatch()
      darkScheme.removeEventListener("change", onSchemeChange)
    })
  })

  const previewColors = createMemo(() => resolveTheme(selectedId(), prefersDark())?.colors ?? originalColors)

  async function select(option: ThemeOption) {
    setSelectedId(option.id)
    await themeStorage.setValue(option.id)
  }

  return (
    <section class="theme-switcher">
      <div class={`theme-grid theme-grid--cols-${props.columns ?? 2}`}>
        <For each={themeOptions}>
          {option => (
            <button
              type="button"
              class="theme-card"
              classList={{ "is-selected": selectedId() === option.id }}
              aria-pressed={selectedId() === option.id}
              onClick={() => void select(option)}
            >
              <span class="theme-card__swatches">
                <For each={option.swatches}>{colors => <ThemeCardPreview colors={colors} />}</For>
              </span>
              <span class="theme-card__name">{i18n.t(option.nameKey)}</span>
            </button>
          )}
        </For>
      </div>

      <Show when={props.showPreview}>
        <section class="theme-preview">
          <h2 class="theme-preview__title">{i18n.t("themePreviewTitle")}</h2>
          <HnPreview colors={previewColors()} />
        </section>
      </Show>
    </section>
  )
}
