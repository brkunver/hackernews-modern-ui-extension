import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: ({ browser }) => ({
    default_locale: "en",
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
    permissions: ["storage"],
    ...(browser === "firefox" && {
      browser_specific_settings: {
        gecko: {
          // A fixed id keeps `storage.sync` data and AMO updates tied to the same add-on.
          id: "hackernews-modern-ui@brkunver",
          strict_min_version: "140.0",
          data_collection_permissions: { required: ["none"] },
        },
      },
    }),
  }),
  modules: ["@wxt-dev/i18n/module", "@wxt-dev/module-solid"],
  webExt: {
    disabled: true,
  },
})
