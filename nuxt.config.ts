// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    '@/assets/css/global.css',
  ],

  runtimeConfig: {
    public: {
      apiBase: 'https://api.blog.redberryinternship.ge/api',
    },
  },
})
