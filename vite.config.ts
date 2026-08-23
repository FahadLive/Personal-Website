import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "/",
    preview: {
        port: 4173,
        host: true, // bind to all network interfaces
        strictPort: true,
        allowedHosts: ["localhost"],
    },
    plugins: [react(), tailwindcss()],
    assetsInclude: ["**/*.webp", "**/*.png", "**/*.svg"],
    build: {
        assetsDir: "",
        copyPublicDir: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                },
            },
        },
    },
});
