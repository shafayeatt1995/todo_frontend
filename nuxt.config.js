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
  modules: ["@nuxt/fonts", "shadcn-nuxt"],
  shadcn: { prefix: "", componentDir: "./components/ui" },
  css: ["~/assets/css/tailwind.css"],
  vite: { plugins: [tailwindcss()] },
});
