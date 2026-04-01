import path from "node:path"
import {mkdir} from "node:fs/promises"
import {test, type Browser, type Page} from "@playwright/test"

type Theme = "dark" | "light"

const ASSETS_DIR = path.join(process.cwd(), "docs", "assets")

const waitForUi = async (page: Page) => {
    await page.waitForLoadState("networkidle")
    await page.evaluate(async () => {
        await document.fonts.ready
    })
}

const captureScreenshot = async (page: Page, fileName: string) => {
    const extension = path.extname(fileName).toLowerCase()
    const isJpeg = extension === ".jpg" || extension === ".jpeg"

    await page.screenshot({
        animations: "disabled",
        caret: "hide",
        path: path.join(ASSETS_DIR, fileName),
        ...(isJpeg
            ? {
                quality: 86,
                type: "jpeg" as const,
            }
            : {
                type: "png" as const,
            }),
    })
}

const createPage = async (
    browser: Browser,
    options: {
        hasTouch?: boolean
        isMobile?: boolean
        theme: Theme
        viewport: {height: number; width: number}
    }
) => {
    const context = await browser.newContext({
        colorScheme: options.theme,
        hasTouch: options.hasTouch,
        isMobile: options.isMobile,
        viewport: options.viewport,
    })

    await context.addInitScript((theme: Theme) => {
        try {
            window.localStorage.setItem("theme", theme)
        } catch {
            // Ignore unavailable storage in screenshot contexts.
        }
    }, options.theme)

    return context.newPage()
}

test.describe.configure({mode: "serial"})

test("refresh documentation screenshots", async ({browser}) => {
    await mkdir(ASSETS_DIR, {recursive: true})

    const desktopDarkPage = await createPage(browser, {
        theme: "dark",
        viewport: {height: 800, width: 1280},
    })

    await desktopDarkPage.goto("/home")
    await waitForUi(desktopDarkPage)
    await captureScreenshot(desktopDarkPage, "home-hero-desktop.png")

    await desktopDarkPage.goto("/experience")
    await waitForUi(desktopDarkPage)
    await captureScreenshot(desktopDarkPage, "experience-desktop.jpg")

    await desktopDarkPage.goto("/projects")
    await waitForUi(desktopDarkPage)
    await captureScreenshot(desktopDarkPage, "projects-section-desktop.png")

    await desktopDarkPage.goto("/privacy")
    await waitForUi(desktopDarkPage)
    await captureScreenshot(desktopDarkPage, "privacy-desktop.jpg")

    await desktopDarkPage.context().close()

    const desktopLightPage = await createPage(browser, {
        theme: "light",
        viewport: {height: 800, width: 1280},
    })

    await desktopLightPage.goto("/home")
    await waitForUi(desktopLightPage)
    await captureScreenshot(desktopLightPage, "home-hero-light-desktop.jpg")

    await desktopLightPage.goto("/projects")
    await waitForUi(desktopLightPage)
    await desktopLightPage.locator("main.content").evaluate((element) => {
        element.scrollTo({behavior: "auto", top: element.scrollHeight})
    })
    await desktopLightPage.waitForTimeout(150)
    await captureScreenshot(desktopLightPage, "footer-light-desktop.jpg")

    await desktopLightPage.context().close()

    const mobilePage = await createPage(browser, {
        hasTouch: true,
        isMobile: true,
        theme: "dark",
        viewport: {height: 844, width: 390},
    })

    await mobilePage.goto("/resume")
    await waitForUi(mobilePage)
    await captureScreenshot(mobilePage, "resume-mobile.png")

    await mobilePage.goto("/about")
    await waitForUi(mobilePage)
    await mobilePage.getByRole("button", {name: "Open navigation menu"}).click()
    await mobilePage.waitForTimeout(150)
    await captureScreenshot(mobilePage, "mobile-menu-open.jpg")

    await mobilePage.goto("/projects")
    await waitForUi(mobilePage)
    await captureScreenshot(mobilePage, "projects-mobile.png")

    await mobilePage.context().close()
})
