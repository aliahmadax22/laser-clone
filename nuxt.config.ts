// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/app.scss"],

  // plugins: [{ src: "~/components/plugins/webfontloader.js", mode: "client" }],

  // vite: {
  //   build: {
  //     rollupOptions: {
  //       external: ["~/components/plugins/webfontloader.js"],
  //     },
  //   },
  // },

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
