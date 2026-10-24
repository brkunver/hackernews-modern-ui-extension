import { For, Show, createSignal, onCleanup, onMount, type JSX } from "solid-js"
import { i18n } from "#i18n"
import {
  DEFAULT_PREFERENCES,
  FONT_SCALES,
  normalizePreferences,
  type Density,
  type FontScale,
  type Preferences,
} from "@/utils/preferences"
import { getStoredPreferences, preferencesStorage, updatePreferences } from "@/utils/storage"
import "./preferences-panel.css"

/** Reactive view of the stored preferences, kept in sync across open surfaces. */
export function usePreferences() {
  const [preferences, setPreferences] = createSignal<Preferences>(DEFAULT_PREFERENCES)

  onMount(() => {
    void getStoredPreferences().then(setPreferences)
    const unwatch = preferencesStorage.watch(value => setPreferences(normalizePreferences(value)))
    onCleanup(unwatch)
  })

  async function update(change: Partial<Preferences>) {
    setPreferences(current => ({ ...current, ...change }))
    setPreferences(await updatePreferences(change))
  }

  return [preferences, update] as const
}

interface SwitchRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SwitchRow(props: SwitchRowProps) {
  return (
    <label class="pref-row">
      <span class="pref-row__text">
        <span class="pref-row__label">{props.label}</span>
        <Show when={props.description}>
          <span class="pref-row__description">{props.description}</span>
        </Show>
      </span>
      <input
        type="checkbox"
        role="switch"
        class="pref-switch"
        checked={props.checked}
        onChange={event => props.onChange(event.currentTarget.checked)}
      />
    </label>
  )
}

interface ChoiceRowProps<T extends string | number> {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  disabled?: boolean
  onChange: (value: T) => void
}

/** A segmented control: one button per option. */
export function ChoiceRow<T extends string | number>(props: ChoiceRowProps<T>) {
  return (
    <div class="pref-row" classList={{ "is-disabled": props.disabled }}>
      <span class="pref-row__label">{props.label}</span>
      <div class="pref-segmented" role="radiogroup" aria-label={props.label}>
        <For each={props.options}>
          {option => (
            <button
              type="button"
              role="radio"
              class="pref-segmented__option"
              classList={{ "is-selected": props.value === option.value }}
              aria-checked={props.value === option.value}
              disabled={props.disabled}
              onClick={() => props.onChange(option.value)}
            >
              {option.label}
            </button>
          )}
        </For>
      </div>
    </div>
  )
}

function Shortcut(props: { keys: string[]; children: JSX.Element }) {
  return (
    <li class="pref-shortcut">
      <span class="pref-shortcut__keys">
        <For each={props.keys}>{key => <kbd>{key}</kbd>}</For>
      </span>
      <span>{props.children}</span>
    </li>
  )
}

/** Layout settings for the options page. */
export function LayoutPreferences() {
  const [preferences, update] = usePreferences()

  const densityOptions: { value: Density; label: string }[] = [
    { value: "comfortable", label: i18n.t("densityComfortable") },
    { value: "compact", label: i18n.t("densityCompact") },
  ]
  const fontScaleOptions = FONT_SCALES.map((value): { value: FontScale; label: string } => ({
    value,
    label: `${value}%`,
  }))

  return (
    <div class="pref-list">
      <SwitchRow
        label={i18n.t("modernLayout")}
        description={i18n.t("modernLayoutDescription")}
        checked={preferences().modernLayout}
        onChange={modernLayout => void update({ modernLayout })}
      />
      <ChoiceRow
        label={i18n.t("density")}
        value={preferences().density}
        options={densityOptions}
        disabled={!preferences().modernLayout}
        onChange={density => void update({ density })}
      />
      <ChoiceRow
        label={i18n.t("fontSize")}
        value={preferences().fontScale}
        options={fontScaleOptions}
        onChange={fontScale => void update({ fontScale })}
      />
    </div>
  )
}

/** Keyboard shortcut settings and cheat sheet for the options page. */
export function KeyboardPreferences() {
  const [preferences, update] = usePreferences()

  return (
    <div class="pref-list">
      <SwitchRow
        label={i18n.t("keyboardNav")}
        checked={preferences().keyboardNav}
        onChange={keyboardNav => void update({ keyboardNav })}
      />
      <ul class="pref-shortcuts" classList={{ "is-disabled": !preferences().keyboardNav }}>
        <Shortcut keys={["j", "k"]}>{i18n.t("shortcutMove")}</Shortcut>
        <Shortcut keys={["o"]}>{i18n.t("shortcutOpen")}</Shortcut>
        <Shortcut keys={["c"]}>{i18n.t("shortcutComments")}</Shortcut>
      </ul>
    </div>
  )
}
