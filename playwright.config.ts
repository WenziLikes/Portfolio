import {defineConfig, devices} from "@playwright/test"

delete process.env.NO_COLOR

const PLAYWRIGHT_ENV = Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string")
)

const PLAYWRIGHT_PORT = 4181
const PLAYWRIGHT_BASE_URL = `http://127.0.0.1:${PLAYWRIGHT_PORT}`

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? "dot" : "list",
    use: {
        baseURL: PLAYWRIGHT_BASE_URL,
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
            },
        },
        {
            name: "phone-320",
            use: {
                browserName: "chromium",
                viewport: {width: 320, height: 568},
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: "phone-360",
            use: {
                browserName: "chromium",
                viewport: {width: 360, height: 740},
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: "phone-375",
            use: {
                browserName: "chromium",
                viewport: {width: 375, height: 667},
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: "phone-390",
            use: {
                browserName: "chromium",
                viewport: {width: 390, height: 844},
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: "phone-430",
            use: {
                browserName: "chromium",
                viewport: {width: 430, height: 932},
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: "tablet-768",
            use: {
                browserName: "chromium",
                viewport: {width: 768, height: 1024},
                isMobile: true,
                hasTouch: true,
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
