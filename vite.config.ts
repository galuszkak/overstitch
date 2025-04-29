import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite' // Import the plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(), // Add the plugin
  ],
})
