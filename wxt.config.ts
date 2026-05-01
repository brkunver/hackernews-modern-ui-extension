import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    default_locale: "en",
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
  },
  modules: ["@wxt-dev/i18n/module", "@wxt-dev/module-solid"],
  webExt: {
    disabled: true,
  },
})
