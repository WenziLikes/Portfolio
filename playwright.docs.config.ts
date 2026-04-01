import {defineConfig, devices} from "@playwright/test"

delete process.env.NO_COLOR

const PLAYWRIGHT_ENV = Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string")
)

const PLAYWRIGHT_PORT = 4181
const PLAYWRIGHT_BASE_URL = `http://127.0.0.1:${PLAYWRIGHT_PORT}`

export default defineConfig({
    testDir: "./scripts",
    reporter: "list",
    use: {
        ...devices["Desktop Chrome"],
        baseURL: PLAYWRIGHT_BASE_URL,
        trace: "off",
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
            },
        },
    ],
    webServer: {
        command: `npm run dev -- --host 127.0.0.1 --port ${PLAYWRIGHT_PORT} --strictPort`,
        env: PLAYWRIGHT_ENV,
        reuseExistingServer: false,
        timeout: 120_000,
        url: PLAYWRIGHT_BASE_URL,
    },
})
