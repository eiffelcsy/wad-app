// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      title: "MeetLah",
      viewport:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
  },
  imports: {
    autoImport: true,
  },
  components: [
    { path: '~/components/custom', extensions: ['vue'] },
  ],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/supabase",
    "@nuxtjs/color-mode",
    "@nuxt/image",
  ],
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
      GMAPS_API_KEY: process.env.GMAPS_API_KEY,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      MS_GRAPH_CLIENT_ID: process.env.MS_GRAPH_CLIENT_ID,
      MS_GRAPH_CLIENT_SECRET: process.env.MS_GRAPH_CLIENT_SECRET,
      MS_GRAPH_REDIRECT_URI: process.env.MS_GRAPH_REDIRECT_URI,
    },
  },
  supabase: {
    redirectOptions: {
      login: "/auth",
      callback: "/",
      include: undefined,
      exclude: ["/", "/landing", "/event/*", "/join", "/create-event"],
      cookieRedirect: false,
    },
  },
  colorMode: {
    preference: 'system',
    classSuffix: ''
  },
  css: ['~/assets/css/locomotive-scroll.css', '~/assets/css/tailwind.css'],
});