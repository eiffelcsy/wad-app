// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' }
  },
  imports: {
    autoImport: true,
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  plugins: ["~/plugins/supabase.ts"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      GAPI_CLIENT_ID: process.env.GAPI_CLIENT_ID,
      GAPI_CLIENT_SECRET: process.env.GAPI_CLIENT_SECRET,
      GAPI_KEY: process.env.GAPI_KEY,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI
    },
  },
  head: {
    meta: [
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      },
    ],
  },
  serverMiddleware: [
    { path: '/api', handler: '~/api/index.js' },
  ],
});
