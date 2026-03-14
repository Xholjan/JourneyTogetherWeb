export default defineNuxtConfig({
  compatibilityDate: "2026-03-10",
  devtools: {
    enabled: false,
  },
  ssr: false,
  runtimeConfig: {
    public: {
      axiosBase: process.env.NUXT_PUBLIC_API_BASE,
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
      currencyFormat: "#,##0.00",
      numberFormat: "#,##0",
      dateFormat: "dd/MM/yyyy",
      dateTimeFormat: "dd/MM/yyyy HH:mm",
    },
  },
  app: {
    head: {
      title: "Journey Together",
    },
  },
  css: [
    "~/assets/css/default.css",
  ],
  modules: ["@bootstrap-vue-next/nuxt"],
  bootstrapVueNext: {
    css: false,
  },
  plugins: [
    {
      src: "~/plugins/axios.js",
      mode: "client",
    },
    {
      src: "~/plugins/auth.js",
      mode: "client",
    },
    {
      src: "~/plugins/toast.js",
      mode: "client",
    },
  ],
  imports: {
    dirs: ["composables", "composables/common"],
  },
});
