import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        // three.js este mare; scena 3D se încarcă separat (lazy), deci avertismentul nu e o problemă
        chunkSizeWarningLimit: 1200
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/test/setup.js",
        css: false
    }
});
