// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/app.scss"],

  plugins: [{ src: "~/components/plugins/webfontloader.ts", mode: "client" }],

  build: {
    extend(config, { isDev, isClient }) {
      if (!config.resolve.extensions.includes(".ts")) {
        config.resolve.extensions.push(".ts");
      }
    },
    rollupOptions: {
      external: ["webfontloader"],
    },
  },

  modules: [
    "@nuxt/eslint",
    ["@pinia/nuxt", { autoImports: ["defineStore", "acceptHMRUpdate"] }],
    "@nuxtjs/tailwindcss",
  ],

  imports: {
    dirs: ["./stores"],
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: "",
      apiDisable: true,
    },
  },

  hooks: {
    "vite:extendConfig": (config, { isClient }) => {
      // Enable this in order for the dynamic components to work
      if (isClient) {
        config.resolve.alias.vue = "vue/dist/vue.esm-bundler";
      }
    },
  },

  compatibilityDate: "2024-07-29",
});
