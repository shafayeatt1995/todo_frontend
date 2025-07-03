import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      API_URL: process.env.API_URL,
    },
  },
  modules: ["@nuxt/fonts", "shadcn-nuxt", "@vite-pwa/nuxt"],
  shadcn: { prefix: "", componentDir: "./components/ui" },
  css: ["~/assets/css/tailwind.css"],
  vite: { plugins: [tailwindcss()] },
  pwa: {
    registerType: "autoUpdate",
    strategies: "generateSW",
    includeAssets: ["logo.png"],
    workbox: {
      importScripts: ["firebase-messaging-sw.js"],
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === "image",
          handler: "CacheFirst",
          options: {
            cacheName: "images-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
      ],
    },
    manifest: {
      name: "Skyinfo Online",
      short_name: "Skyinfo",
      description: "Skyinfo Online",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/",
      icons: [
        {
          src: "/logo.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/logo.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
});
