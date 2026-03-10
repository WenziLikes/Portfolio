import {defineConfig} from "vitest/config"
import react from "@vitejs/plugin-react"

const isCloudDocsWorkspace = process.cwd().includes("/Mobile Documents/") || process.cwd().includes("CloudDocs")

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "build",
    },
    preview: {
        host: "localhost",
        port: 4173,
    },
    server: {
        host: "localhost",
        port: 3000,
        watch: isCloudDocsWorkspace ? {
            awaitWriteFinish: {
                pollInterval: 100,
                stabilityThreshold: 200,
            },
            ignored: ["**/build/**", "**/node_modules/**"],
            interval: 250,
            usePolling: true,
        } : undefined,
    },
    test: {
        css: true,
        environment: "happy-dom",
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        setupFiles: "./src/setupTests.ts",
    },
})
