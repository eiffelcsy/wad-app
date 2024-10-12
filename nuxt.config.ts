// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      viewport:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
  },
  imports: {
    autoImport: true,
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/supabase", "@nuxtjs/color-mode"],
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
      GAPI_CLIENT_ID: process.env.GAPI_CLIENT_ID,
      GAPI_CLIENT_SECRET: process.env.GAPI_CLIENT_SECRET,
      GAPI_KEY: process.env.GAPI_KEY,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    },
  },
  supabase: {
    redirectOptions: {
      login: "/auth",
      callback: "/",
      include: undefined,
      exclude: ["/", "/event/*", "/join"],
      cookieRedirect: false,
    },
  },
  colorMode: {
    preference: 'system',
    classSuffix: ''
  },
});
